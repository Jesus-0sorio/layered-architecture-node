/* eslint-disable class-methods-use-this */
import sharp from 'sharp';
import { FILTERS } from '../commons/constants.js';
import ApplyFilter from './ApplyFilter/ApplyFilter.js';
import Observer from './ApplyFilter/Observer.js';

class ApplyFiltersService {
  constructor({ processRepository, minioService }) {
    this.processRepository = processRepository;
    this.minioService = minioService;
  }

  async applyFilters(newImages) {
    newImages.images.map(async (image) => {
      const imageBuffer = await sharp(image.buffer).toBuffer();
      const applyImgFilter = new ApplyFilter();
      const observer = new Observer({ processRepository: this.processRepository });

      image.filters.forEach((filter) => {
        applyImgFilter.subscribe({
          imgId: image.id,
          filterId: filter.id,
          observer,
        });
      });

      image.filters.forEach(async (filter) => {
        const data = {
          id: newImages.id,
          imgId: image.id,
          filterId: filter.id,
        };

        const fileName = this.rename(image.originalname, filter.name);

        if (filter.name === FILTERS.GRAYSCALE) {
          const imgBuffer = await sharp(imageBuffer).grayscale().toBuffer();

          const imgUrl = await this.saveImage({
            originalname: fileName,
            buffer: imgBuffer,
          });

          applyImgFilter.notify({ ...data, imgUrl });
        }
        if (filter.name === FILTERS.NEGATIVE) {
          const imgBuffer = await sharp(imageBuffer).negate({ alpha: false }).toBuffer();

          const imgUrl = await this.saveImage({
            originalname: fileName,
            buffer: imgBuffer,
          });

          applyImgFilter.notify({ ...data, imgUrl });
        }
        if (filter.name === FILTERS.BLUR) {
          const imgBuffer = await sharp(imageBuffer).blur(1 + 0.7 / 2).toBuffer();

          const imgUrl = await this.saveImage({
            originalname: fileName,
            buffer: imgBuffer,
          });

          applyImgFilter.notify({ ...data, imgUrl });
        }
      });
    });
  }

  async saveImage(image) {
    await Promise.resolve(this.minioService.saveImage(image));
    const res = await Promise.resolve(this.minioService.generateSignedUrl(image.originalname));
    return res;
  }

  rename(originalname, filterName) {
    const originalNameParts = originalname.split('.');
    const extension = originalNameParts[1];
    return `${originalNameParts[0]}-${filterName}.${extension}`;
  }
}

export default ApplyFiltersService;
