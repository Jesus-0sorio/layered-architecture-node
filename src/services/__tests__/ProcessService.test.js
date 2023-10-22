import {
  describe, test, expect, jest,
} from '@jest/globals';
import ProcessService from '../ProcessService.js';

describe('ProcessService', () => {
  const processRepository = {
    save: jest.fn(),
    getById: jest.fn(),
  };
  const minioService = {
    saveImage: jest.fn(),
  };
  const processService = new ProcessService({ processRepository, minioService });

  test('Should return payload', async () => {
    const payload = {
      filters: ['negative', 'grayscale'],
      images: [
        { originalname: 'img.png' },
        { originalname: 'img1.png' },
      ],
    };

    const expectedData = {
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
});
