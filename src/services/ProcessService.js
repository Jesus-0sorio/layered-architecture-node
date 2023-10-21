import Joi from 'joi';
import Boom from '@hapi/boom';
import { FILTERS } from '../commons/constants.js';

class ProcessService {
  processRepository = null;

  minioService = null;

  payloadValidation = Joi.object({
    filters: Joi.array().required()
      .min(1)
      .items(
        Joi.string().valid(FILTERS.NEGATIVE, FILTERS.GRAYSCALE, FILTERS.BLUR),
      ),
    images: Joi.array().required().min(1),
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
    const newData = {
      filters,
      images: images.map((image) => ({
        imageUrl: image.originalname,
        filters: filters.map((filter) => ({
          name: filter,
          status: 'in-progress',
        })),
      })),
    };
    const newProcess = await this.processRepository.save(newData);

    const imgsPromises = images.map(async (image) => {
      await this.minioService.saveImage(image);
    });

    await Promise.all(imgsPromises);

    return newProcess;
  }

  async getProcessById(id) {
    const process = await this.processRepository.getById(id);
    if (!process) {
      throw Boom.notFound(`Process with id ${id} not found`);
    }
    return process;
  }
}

export default ProcessService;
