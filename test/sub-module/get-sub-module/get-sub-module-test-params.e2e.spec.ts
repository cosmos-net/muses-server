/* eslint-disable hexagonal-architecture/enforce */
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { TestingModule } from '@nestjs/testing';
import { ModuleFactory } from '@test/utils/config/module-factory';
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
      test('Then expect to return a 500 status code', async () => {
        const numericId = faker.number.int();

        const response = await request(app.getHttpServer()).get(`/sub-module/${numericId}`);

        expect(response.status).toBe(500);
        expect(response.body).toEqual({});
      });
    });

    describe('When send a request with invalid string id', () => {
      test('Then expect to return a 500 status code', async () => {
        const stringId = faker.string.sample();

        const response = await request(app.getHttpServer()).get(`/sub-module/${stringId}`);

        expect(response.status).toBe(500);
        expect(response.body).toEqual({});
      });
    });

    describe('When the id does not exists', () => {
      test('Then expect to return an empty ', async () => {
        const objId = faker.database.mongodbObjectId();

        const response = await request(app.getHttpServer()).get(`/sub-module/${objId}`);

        expect(response.status).toBe(404);
        expect(response.body).toEqual({
          message: 'Sub Module not found',
          status: 404,
          response: 'Sub Module not found',
          name: 'SubModuleNotFoundException',
        });
      });
    });
  });
});
