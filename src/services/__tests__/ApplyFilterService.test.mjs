import sharp from 'sharp';
import {
  describe, test, expect, jest,
  beforeEach,
} from '@jest/globals';
import fs from 'fs';
import path from 'path';
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
      const imagePath = path.join(__dirname, 'assets', 'img1.png'); // Ajusta la ruta según tu estructura
      const mockImageBuffer = fs.readFileSync(imagePath); // Leer la imagen como buffer

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
          arrayFilters: [{ 'image._id': imgId }, { 'filter._id': filterId }],
        },
      );
    });
  });
});
