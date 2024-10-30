import {
  describe, test, expect, jest,
  beforeEach,
} from '@jest/globals';

import ApplyFilter from '../ApplyFilter/ApplyFilter.js';

describe('ApplyFilter', () => {
  let applyFilter;
  const observer = jest.fn();

  beforeEach(() => {
    applyFilter = new ApplyFilter();
  });

  describe('subscribe', () => {
    test('should add observer to observers list', () => {
      applyFilter.subscribe({ imgId: 1, filterId: 2, observer });
      expect(applyFilter.subscribers).toMatchObject({ 1: { 2: observer } });
    });
  });

  describe('unsubscribe', () => {
    test('should remove observer from observers list', () => {
      applyFilter.subscribe({ imgId: 1, filterId: 2, observer });
      applyFilter.unsubscribe(1, 2);
      expect(applyFilter.subscribers).toMatchObject({ 1: {} });
    });

    test('should not remove observer from observers list if imgId is not found', () => {
      applyFilter.subscribe({ imgId: 1, filterId: 2, observer });
      applyFilter.unsubscribe(2, 2);
      expect(applyFilter.subscribers).toMatchObject({ 1: { 2: observer } });
    });
  });

  describe('notify', () => {
    test('should call observer with correct parameters', () => {
      const observerMock = { notify: jest.fn() };

      applyFilter.subscribe({
        imgId: 'img123',
        filterId: 'filter456',
        observer: observerMock,
      });

      applyFilter.notify({
        id: 'processId',
        imgId: 'img123',
        filterId: 'filter456',
        imgUrl: 'http://example.com/image.jpg',
      });

      expect(observerMock.notify).toHaveBeenCalledWith(
        'processId',
        'img123',
        'filter456',
        'http://example.com/image.jpg',
      );
    });

    test('should not call observer if imgId is not found', () => {
      applyFilter.subscribe({ imgId: 1, filterId: 2, observer });
      applyFilter.notify({
        id: 1, imgId: 2, filterId: 2, imgUrl: 'http://example.com/image.jpg',
      });
      expect(observer).not.toHaveBeenCalled();
    });
  });
});
