import sharp from 'sharp';
import {
  describe, test, expect, jest,
  beforeEach,
} from '@jest/globals';
import ApplyFiltersService from '../ApplyFilterService.js';
import Observer from '../ApplyFilter/Observer.js';
import ApplyFilter from '../ApplyFilter/ApplyFilter.js';

describe('ApplyFiltersService', () => {
  let applyFiltersService;
  let processRepository;
  let minioService;

  beforeEach(() => {
    processRepository = {
      updateOne: jest.fn(),
    };
    minioService = {
      saveImage: jest.fn(),
    };
    applyFiltersService = new ApplyFiltersService({ processRepository, minioService });
  });

  describe('applyFilters', () => {
    test('should apply filters to the image', async () => {
      const id = '123';
      const imgId = '456';
      const filterId = '789';
      const imgUrl = 'https://example.com/image.jpg';
      // Create a mock image buffer
      const mockImageBuffer = Buffer.from([
        137, 80, 78, 71, 13, 10, 26, 10, 0, 0, 0, 13, 73, 72, 68, 82, 0, 0, 0,
        10, 0, 0, 0, 10, 8, 6, 0, 0, 0, 26, 88, 77, 0, 0, 0, 2, 98, 80, 78, 71,
        1, 2, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      ]);

      // Use the mock image buffer in your test
      const newImages = {
        id,
        images: [
          {
            id: imgId,
            buffer: mockImageBuffer,
            originalname: 'image.jpg',
            filters: [
              {
                id: filterId,
                name: 'grayscale',
              },
            ],
          },
        ],
      };

      const applyImgFilter = new ApplyFilter();
      const observer = new Observer({ processRepository });
      const sharpGrayscale = jest.spyOn(sharp.prototype, 'grayscale');
      const sharpNegate = jest.spyOn(sharp.prototype, 'negate');
      const sharpBlur = jest.spyOn(sharp.prototype, 'blur');
      const sharpToBuffer = jest.spyOn(sharp.prototype, 'toBuffer');

      applyImgFilter.subscribe({
        imgId,
        filterId,
        observer,
      });

      await applyFiltersService.applyFilters(newImages);

      await expect(sharpGrayscale).toHaveBeenCalled();

      expect(sharpNegate).toHaveBeenCalledWith({ alpha: false });
      expect(sharpBlur).toHaveBeenCalledWith(1 + 0.7 / 2);
      expect(sharpToBuffer).toHaveBeenCalledWith();
      expect(minioService.saveImage).toHaveBeenCalledWith({
        originalname: 'image_grayscale.jpg',
        buffer: expect.any(Buffer),
      });
      expect(processRepository.updateOne).toHaveBeenCalledWith(
        { _id: id, 'images._id': imgId, 'images.filters._id': filterId },
        {
          $set: {
            'images.$[image].filters.$[filter].status': 'completed',
            'images.$[image].filters.$[filter].imgUrl': imgUrl,
          },
        },
        {
          arrayFilters: [
            { 'image._id': imgId },
            { 'filter._id': filterId }],
        },
      );
    });
  });
});
