import sharp from 'sharp';
import {
  describe, test, expect, jest, beforeEach,
} from '@jest/globals';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import ApplyFiltersService from '../ApplyFilterService.js';
import Observer from '../ApplyFilter/Observer.js';
import ApplyFilter from '../ApplyFilter/ApplyFilter.js';

// eslint-disable-next-line no-underscore-dangle
const __filename = fileURLToPath(import.meta.url);
// eslint-disable-next-line no-underscore-dangle
const __dirname = path.dirname(__filename);

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
      generateSignedUrl: jest.fn(),
    };
    applyFiltersService = new ApplyFiltersService({
      processRepository,
      minioService,
    });
  });

  describe('applyFilters', () => {
    test('should apply filters to the image', async () => {
      const id = '123';
      const imgId = '456';
      const filterId = '789';

      const imagePath = path.join(__dirname, 'assets', 'img1.png');
      const mockImageBuffer = fs.readFileSync(imagePath);

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

      // Espiar métodos de sharp
      const sharpGrayscale = jest
        .spyOn(sharp.prototype, 'grayscale')
        .mockReturnValue(sharp(mockImageBuffer));
      const sharpNegate = jest
        .spyOn(sharp.prototype, 'negate')
        .mockReturnValue(sharp(mockImageBuffer));
      const sharpBlur = jest
        .spyOn(sharp.prototype, 'blur')
        .mockReturnValue(sharp(mockImageBuffer));
      const sharpToBuffer = jest
        .spyOn(sharp.prototype, 'toBuffer')
        .mockResolvedValue(mockImageBuffer);

      applyImgFilter.subscribe({
        imgId,
        filterId,
        observer,
      });

      await applyFiltersService.applyFilters(newImages);

      expect(sharpGrayscale).toHaveBeenCalled();
      expect(sharpNegate).toHaveBeenCalled();
      expect(sharpBlur).toHaveBeenCalled();
      await expect(sharpToBuffer).toHaveBeenCalled();
      expect(minioService.saveImage).toHaveBeenCalledWith({
        originalname: 'image_grayscale.jpg',
        buffer: expect.any(Buffer),
      });
      expect(processRepository.updateOne).toHaveBeenCalledWith(
        { _id: id, 'images._id': imgId, 'images.filters._id': filterId },
        {
          $set: {
            'images.$[image].filters.$[filter].status': 'completed',
            'images.$[image].filters.$[filter].imgUrl': expect.any(String),
          },
        },
        {
          arrayFilters: [{ 'image._id': imgId }, { 'filter._id': filterId }],
        },
      );
    });
  });
});
