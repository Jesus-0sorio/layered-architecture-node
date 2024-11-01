import {
  describe, test, expect, jest,
} from '@jest/globals';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import ProcessService from '../ProcessService.js';

// eslint-disable-next-line no-underscore-dangle
const __filename = fileURLToPath(import.meta.url);
// eslint-disable-next-line no-underscore-dangle
const __dirname = path.dirname(__filename);

describe('ProcessService', () => {
  const processRepository = {
    save: jest.fn(),
    getById: jest.fn(),
  };
  const minioService = {
    saveImage: jest.fn(),
    generateSignedUrl: jest.fn(),
  };
  const processService = new ProcessService({ processRepository, minioService });

  test('Should return payload', async () => {
    const imagePath = path.join(__dirname, 'assets', 'img1.png');
    const payload = {
      filters: ['negative', 'grayscale'],
      images: [
        {
          originalname: 'img.png',
          buffer: Buffer.from(fs.readFileSync(imagePath)),
        },
      ],
    };

    const expectedData = {
      filters: ['negative', 'grayscale'],
      images: [
        {
          imageUrl: 'img.png',
          filters: [
            {
              name: 'negative',
              status: 'in-progress',
              originalname: 'img.png',
              _id: '60f0f0b3e6b3f3a3e8b0b0b0',

            },
            {
              name: 'grayscale',
              status: 'in-progress',
              originalname: 'img.png',
              _id: '60f0f0b3e6b3f3a3e8b0b0b0',
            },
          ],
          originalname: 'img.png',
        },
      ],
      _id: '60f0f0b3e6b3f3a3e8b0b0b0',
      originalname: 'img.png',
    };

    processRepository.save = jest.fn()
      .mockImplementationOnce(() => expectedData);
    const process = await processService.applyFilters(payload);
    expect(process).toMatchObject(expectedData);
  });

  test('Should throw error when payload is invalid', async () => {
    const payload = {
      filters: [],
      images: [],
    };
    await expect(processService.applyFilters(payload))
      .rejects.toThrowError('"filters" must contain at least 1 items');
  });

  test('Should throw error when process not found', async () => {
    const id = 'invalid-id';
    processRepository.getById = jest.fn()
      .mockImplementationOnce(() => null);
    await expect(processService.getProcessById(id))
      .rejects.toThrowError(`Process with id ${id} not found`);
  });

  test('Should return process', async () => {
    const id = '3225fdsafas';
    const expectedData = {
      id,
      filters: ['negative', 'grayscale'],
      images: [
        {
          imageUrl: 'img.png',
          filters: [
            { name: 'negative', status: 'in-progress' },
            { name: 'grayscale', status: 'in-progress' },
          ],
        },
        {
          imageUrl: 'img1.png',
          filters: [
            { name: 'negative', status: 'in-progress' },
            { name: 'grayscale', status: 'in-progress' },
          ],
        },
      ],
    };
    processRepository.getById = jest.fn()
      .mockImplementationOnce(() => expectedData);
    const process = await processService.getProcessById(id);
    expect(process).toMatchObject(expectedData);
  });

  test('Should throw error when images size exceeds 50MB', async () => {
    const payload = {
      filters: ['negative', 'grayscale'],
      images: [
        { originalname: 'img.png', size: 50 * 1024 * 1024 },
        { originalname: 'img1.png', size: 1 },
      ],
    };
    await expect(processService.applyFilters(payload))
      .rejects.toThrowError('Images size exceeds 50MB');
  });
});
