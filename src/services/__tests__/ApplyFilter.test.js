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
      applyFilter.subscribe({ imgId: 1, filterId: 2, observer });
      applyFilter.notify({
        id: 1, imgId: 1, filterId: 2, imgUrl: 'http://example.com/image.jpg',
      });
      expect(applyFilter.subscribers[1][2]).toBe(observer);
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
