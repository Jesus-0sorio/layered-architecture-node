import supertest from 'supertest';
import {
  describe,
  expect,
  beforeEach,
  afterEach,
  test,
} from '@jest/globals';
import app from '../app.js';
import { closeConnection, startConnection } from '../mongo/index.js';

beforeEach(async () => {
  await startConnection();
});

afterEach(async () => {
  await closeConnection();
});

describe('Test app Express server', () => {
  test('GET / should return "Holi 😶‍🌫️"', async () => {
    const response = await supertest(app).get('/');
    expect(response.status).toBe(200);
    expect(response.text).toBe('Holi 😶‍🌫️');
  });

  test('GET /images should return "Holi desde filters 😶‍🌫️"', async () => {
    const response = await supertest(app).get('/images');

    expect(response.status).toBe(200);
    expect(response.text).toBe('Holi desde filters 😶‍🌫️');
  });

  test('POST /images should return 200 status', async () => {
    const response = await supertest(app).post('/images')
      .set('Content-Type', 'multipart/form-data')
      .field('filters[]', 'grayscale')
      .field('filters[]', 'blur')
      .attach('images[]', 'src/__tests__/assets/img1.png');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('filters');
    expect(response.body).toHaveProperty('_id');
    expect(response.body).toHaveProperty('createdAt');
    expect(response.body).toHaveProperty('updatedAt');
  });

  test('POST /images should return 422 status', async () => {
    const response = await supertest(app).post('/images')
      .set('Content-Type', 'multipart/form-data')
      .field('filters[]', 'grayscale')
      .field('filters[]', 'blur');

    expect(response.status).toBe(422);
    expect(response.body.message).toBe('"images" must contain at least 1 items');
  });

  test('POST /images should return "Filters are required"', async () => {
    const response = await supertest(app).post('/images')
      .set('Content-Type', 'multipart/form-data')
      .attach('images[]', 'src/__tests__/assets/img1.png');

    expect(response.status).toBe(422);
    expect(response.body.message).toBe('Filters are required');
  });

  test('POST /images should return 200 status', async () => {
    const response = await supertest(app).post('/images')
      .set('Content-Type', 'multipart/form-data')
      .field('filters[]', 'grayscale')
      .field('filters[]', 'blur')
      .attach('images[]', 'src/__tests__/assets/img1.png');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('filters');
    expect(response.body).toHaveProperty('_id');
    expect(response.body).toHaveProperty('createdAt');
    expect(response.body).toHaveProperty('updatedAt');
  });

  test('POST /images should return 422 status', async () => {
    const response = await supertest(app).post('/images')
      .set('Content-Type', 'multipart/form-data')
      .field('filters[]', 'grayscale');

    expect(response.status).toBe(422);
  });

  test('POST /images should return 500 status', async () => {
    closeConnection();
    const response = await supertest(app).post('/images')
      .set('Content-Type', 'multipart/form-data')
      .field('filters[]', 'grayscale')
      .field('filters[]', 'blur')
      .attach('images[]', 'src/__tests__/assets/img1.png');

    expect(response.status).toBe(500);
  });
});
