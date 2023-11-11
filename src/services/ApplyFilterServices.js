import sharp from 'sharp';
import { FILTERS } from '../commons/constants.js';
import ApplyFilter from './ApplyFilter/ApplyFilter.js';
import Observer from './ApplyFilter/Observer.js';

class ApplyFiltersService {
  constructor({ processRepository, document }) {
    this.document = document;
    this.processRepository = processRepository;
  }

  async applyFilters() {
    this.document.images.map(async (image) => {
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
        if (filter.name === FILTERS.GRAYSCALE) {
          const imgBuffer = await sharp(imageBuffer).grayscale().toBuffer();
          applyImgFilter.notify(this.document.id, image.id, filter.id, imgBuffer);
        }
        if (filter.name === FILTERS.NEGATIVE) {
          const imgBuffer = await sharp(imageBuffer).negate().toBuffer();
          applyImgFilter.notify(this.document.id, image.id, filter.id, imgBuffer);
        }
        if (filter.name === FILTERS.BLUR) {
          const imgBuffer = await sharp(imageBuffer).blur().toBuffer();
          applyImgFilter.notify(this.document.id, image.id, filter.id, imgBuffer);
        }
      });
    });
  }
}

export default ApplyFiltersService;
