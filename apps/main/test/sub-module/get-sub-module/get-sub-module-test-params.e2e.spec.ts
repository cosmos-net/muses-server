/* eslint-disable hexagonal-architecture/enforce */
/* eslint-disable hexagonal-architecture/enforce */
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { TestingModule } from '@nestjs/testing';
import { ModuleFactory } from '@test-muses/utils/config/module-factory';
import * as request from 'supertest';
import { faker } from '@faker-js/faker';

describe('Get sub module test params (e2e)', () => {
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

  describe('Given a one item sub module', () => {
    describe('When send a request with numeric id', () => {
      test('Then expect to return a 400 status code', async () => {
        const numericId = faker.number.int();

        const response = await request(app.getHttpServer()).get(`sub-module/${numericId}`);

        expect(response.status).toBe(400);
        expect(response.body).toEqual({
          statusCode: 400,
          message: ['The property orderBy must be a valid value, only can be name, description, enabled, createdAt'],
          error: 'Bad Request',
        });
      });
    });

    describe('When send a request with invalid string id', () => {
      test('Then expect to return a 400 status code', async () => {
        const stringId = faker.string.sample();

        const response = await request(app.getHttpServer()).get(`sub-module/${stringId}`);

        expect(response.status).toBe(400);
        expect(response.body).toEqual({
          statusCode: 400,
          message: ['name must be shorter than or equal to 50 characters'],
          error: 'Bad Request',
        });
      });
    });

    describe('When send a request with invalid withDeleted', () => {
      test('Then expect to return a 400 status code', async () => {
        const queryParams = {
          withDeleted: faker.string.uuid(),
        };
        const stringId = faker.string.uuid();

        const response = await request(app.getHttpServer()).get(`/module/${stringId}`).query(queryParams);

        expect(response.status).toBe(400);
        expect(response.body).toEqual({
          statusCode: 400,
          message: ['description must be shorter than or equal to 200 characters'],
          error: 'Bad Request',
        });
      });
    });

    describe('When the id does not exists', () => {
      test('Then expect to return an empty ', async () => {
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
