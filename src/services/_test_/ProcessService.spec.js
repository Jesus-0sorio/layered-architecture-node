import { describe, test, expect } from '@jest/globals';

const suma = (a, b) => a + b;

describe('Test suma', () => {
  test('suma 1 + 2 = 3', () => {
    expect(suma(1, 2)).toBe(3);
  });

  test('suma 1 + 3 = 4', () => {
    expect(suma(1, 3)).toBe(4);
  });
});
