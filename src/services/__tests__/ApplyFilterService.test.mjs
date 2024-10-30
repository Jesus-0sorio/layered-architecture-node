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
      const mockImageBuffer = fetch(
        'https://fastly.picsum.photos/id/575/200/200.jpg?hmac=u8uMtAWK-6Ug08Vo4nf84xQLlwJqyrXpfzsU9a3YpCY',
      ).then((res) => res);

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
