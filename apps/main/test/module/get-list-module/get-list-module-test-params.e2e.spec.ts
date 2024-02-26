/* eslint-disable hexagonal-architecture/enforce */
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { TestingModule } from '@nestjs/testing';
import { ModuleFactory } from '@test-muses/utils/config/module-factory';
import * as request from 'supertest';
import { faker } from '@faker-js/faker';

describe('Get list module test params (e2e)', () => {
  let moduleFixture: TestingModule;
  let app: INestApplication;

  beforeAll(async () => {
    moduleFixture = await ModuleFactory.createModule();

    app = moduleFixture.createNestApplication();

    app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true, forbidNonWhitelisted: true }));

    await app.init();
  });

  afterAll(async () => {
    if (app) await app.close();
  });

  jest.setTimeout(99999999);

  describe('Given a list of modules items', () => {
    describe('When send a request with invalid orderBy', () => {
      test('Then expect to return a 400 status code', async () => {
        const queryParams = {
          orderBy: faker.lorem.word(),
        };

        const response = await request(app.getHttpServer()).get('/module/list').query(queryParams);

        expect(response.status).toBe(400);
        expect(response.body).toEqual({
          statusCode: 400,
          message: ['The property orderBy must be a valid value, only can be name, description, enabled, createdAt'],
          error: 'Bad Request',
        });
      });
    });

    describe('When send a request with invalid name', () => {
      test('Then expect to return a 400 status code', async () => {
        const queryParams = {
          name: faker.string.alpha(51),
        };

        const response = await request(app.getHttpServer()).get('/module/list').query(queryParams);

        expect(response.status).toBe(400);
        expect(response.body).toEqual({
          statusCode: 400,
          message: ['name must be shorter than or equal to 50 characters'],
          error: 'Bad Request',
        });
      });
    });

    describe('When send a request with invalid description', () => {
      test('Then expect to return a 400 status code', async () => {
        const queryParams = {
          description: faker.string.alpha(201),
        };

        const response = await request(app.getHttpServer()).get('/module/list').query(queryParams);

        expect(response.status).toBe(400);
        expect(response.body).toEqual({
          statusCode: 400,
          message: ['description must be shorter than or equal to 200 characters'],
          error: 'Bad Request',
        });
      });
    });

    describe('When send a request with invalid isEnabled', () => {
      test('Then expect to return a 400 status code', async () => {
        const queryParams = {
          isEnabled: faker.lorem.word(),
        };

        const response = await request(app.getHttpServer()).get('/module/list').query(queryParams);

        expect(response.status).toBe(400);
        expect(response.body).toEqual({
          statusCode: 400,
          message: 'The value must be a boolean',
          error: 'Bad Request',
        });
      });
    });

    describe('When send a request with invalid page', () => {
      test('Then expect to return a 400 status code', async () => {
        const queryParams = {
          page: faker.lorem.word(),
        };

        const response = await request(app.getHttpServer()).get('/module/list').query(queryParams);

        expect(response.status).toBe(400);
        expect(response.body).toEqual({
          statusCode: 400,
          message: ['page must not be less than 1', 'page must be an integer number'],
          error: 'Bad Request',
        });
      });
    });

    describe('When send a request with invalid limit', () => {
      test('Then expect to return a 400 status code', async () => {
        const queryParams = {
          limit: faker.lorem.word(),
        };

        const response = await request(app.getHttpServer()).get('/module/list').query(queryParams);

        expect(response.status).toBe(400);
        expect(response.body).toEqual({
          statusCode: 400,
          message: [
            'limit must not be greater than 50',
            'limit must not be less than 1',
            'limit must be an integer number',
          ],
          error: 'Bad Request',
        });
      });
    });

    describe('When the database is empty', () => {
      test('Then expect to return an empty list', async () => {
        const response = await request(app.getHttpServer()).get('/module/list');

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
          items: [],
          meta: {
            page: 1,
            limit: 10,
            totalItems: 0,
            totalPages: 0,
            hasPreviousPage: false,
            hasNextPage: false,
          },
        });
      });
    });
  });
});
