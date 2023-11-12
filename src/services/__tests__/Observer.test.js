import {
  describe, test, expect, jest,
  beforeEach,
} from '@jest/globals';
import Observer from '../ApplyFilter/Observer.js';

describe('Observer', () => {
  let observer;
  let processRepository;

  beforeEach(() => {
    processRepository = {
      updateOne: jest.fn(),
    };
    observer = new Observer({ processRepository });
  });

  describe('notify', () => {
    test('should save the process to the repository', async () => {
      const id = '123';
      const imgId = '456';
      const filterId = '789';
      const imgUrl = 'https://example.com/image.jpg';

      await observer.notify(id, imgId, filterId, imgUrl);

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
            { 'filter._id': filterId },
          ],
        },
      );
    });
  });
});
