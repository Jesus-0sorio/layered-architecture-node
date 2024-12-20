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
      saveImage: jest.fn().mockResolvedValue({}),
      generateSignedUrl: jest
        .fn()
        .mockReturnValue('http://example.com/signed-url'),
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
      const mockImageBuffer = Buffer.from(fs.readFileSync(imagePath));

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
              {
                id: '101',
                name: 'negative',
              },
              {
                id: '102',
                name: 'blur',
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
      expect(sharpNegate).toHaveBeenCalledWith({ alpha: false });
      expect(sharpBlur).toHaveBeenCalledWith(1 + 0.7 / 2);
      await expect(sharpToBuffer).toHaveBeenCalled();
      expect(minioService.saveImage).toHaveBeenCalledWith({
        originalname: expect.stringMatching(/image[-_][a-z]+\.jpg/), // Aceptar formatos que incluyan guiones o guiones bajos
        buffer: expect.any(Buffer),
      });
    });
  });
});
