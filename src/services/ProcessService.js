import Joi from 'joi';
import Boom from '@hapi/boom';
import { FILTERS } from '../commons/constants.js';
import ApplyFiltersService from './ApplyFilterService.js';

class ProcessService {
  processRepository = null;

  minioService = null;

  payloadValidation = Joi.object({
    filters: Joi.array().required()
      .min(1)
      .items(
        Joi.string().valid(FILTERS.NEGATIVE, FILTERS.GRAYSCALE, FILTERS.BLUR),
      ),
    images: Joi.array().min(1).required(),
  }).required();

  constructor({ processRepository, minioService }) {
    this.processRepository = processRepository;
    this.minioService = minioService;
  }

  async applyFilters(payload) {
    try {
      await this.payloadValidation.validateAsync(payload);
    } catch (e) {
      throw Boom.badData(e.message, { e });
    }
    const { images, filters } = payload;

    const imagesSize = images.reduce((acc, image) => acc + image.size, 0);

    if (imagesSize > 50 * 1024 * 1024) {
      throw Boom.badData('Images size exceeds 50MB');
    }

    const imgsPromises = images.map(async (image) => {
      await this.minioService.saveImage(image);
    });

    await Promise.all(imgsPromises);

    const newData = await this.generateNewData(images, filters, this.minioService);

    const newProcess = await this.processRepository.save(newData);

    const newImages = {
      id: newProcess._id,
      images: newProcess.images.map((image) => ({
        id: image._id,
        filters: image.filters.map((filter) => ({
          id: filter._id,
          name: filter.name,
        })),
        originalname: image.originalname,
        buffer: images.find((img) => img.originalname === image.originalname).buffer,
      })),
    };

    new ApplyFiltersService({
      processRepository: this.processRepository,
      minioService: this.minioService,
    }).applyFilters(newImages);
    return newProcess;
  }

  async getProcessById(id) {
    const process = await this.processRepository.getById(id);
    if (!process) {
      throw Boom.notFound(`Process with id ${id} not found`);
    }
    return process;
  }

  async generateImageData(image, filters) {
    const imageUrl = await this.minioService.generateSignedUrl(image.originalname);
    const filterData = filters.map((filter) => ({
      name: filter,
      status: 'in-progress',
    }));

    return { imageUrl, filters: filterData, originalname: image.originalname };
  }

  async generateNewData(images, filters) {
    const imagesData = await Promise.all(
      images.map((image) => this.generateImageData(image, filters)),
    );

    const newData = {
      filters,
      images: imagesData,
    };
    return newData;
  }
}

export default ProcessService;
