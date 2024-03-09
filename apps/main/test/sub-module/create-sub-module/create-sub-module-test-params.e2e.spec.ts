/* eslint-disable hexagonal-architecture/enforce */
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { TestingModule } from '@nestjs/testing';
import { ModuleFactory } from '@test-muses/utils/config/module-factory';
import * as request from 'supertest';
import { faker } from '@faker-js/faker';
import { ObjectId } from 'mongodb';

describe('Create submodule test params (e2e)', () => {
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

  describe('Given we want to create a submodule', () => {
    describe('when send name with length less than 3', () => {
      test('Then expect a throw Bad Request exception', async () => {
        const params = {
          name: faker.string.alpha(2),
          description: faker.string.alpha(10),
          enabled: true,
          module: new ObjectId().toHexString(),
        };

        const response = await request(app.getHttpServer()).post('/sub-module/').send(params);

        expect(response.status).toBe(400);
        expect(response.body).toEqual({
          statusCode: 400,
          message: ['name must be longer than or equal to 3 characters'],
          error: 'Bad Request',
        });
      });
    });

    describe('When send name with length greater than 50', () => {
      test('Then expect a throw Bad Request exception', async () => {
        const params = {
          name: faker.string.alpha(51),
          description: faker.string.alpha(10),
          enabled: true,
          module: new ObjectId().toHexString(),
        };

        const response = await request(app.getHttpServer()).post('/sub-module/').send(params);

        expect(response.status).toBe(400);
        expect(response.body).toEqual({
          statusCode: 400,
          message: ['name must be shorter than or equal to 50 characters'],
          error: 'Bad Request',
        });
      });
    });

    describe('When send description with length less than 8', () => {
      test('Then expect a throw Bad Request exception', async () => {
        const params = {
          name: faker.string.alpha(10),
          description: faker.string.alpha(7),
          enabled: true,
          module: new ObjectId().toHexString(),
        };

        const response = await request(app.getHttpServer()).post('/sub-module/').send(params);

        expect(response.status).toBe(400);
        expect(response.body).toEqual({
          statusCode: 400,
          message: ['description must be longer than or equal to 8 characters'],
          error: 'Bad Request',
        });
      });
    });

    describe('When send description with length greater than 200', () => {
      test('Then expect a throw Bad Request exception', async () => {
        const params = {
          name: faker.string.alpha(10),
          description: faker.string.alpha(201),
          enabled: true,
          module: new ObjectId().toHexString(),
        };

        const response = await request(app.getHttpServer()).post('/sub-module/').send(params);

        expect(response.status).toBe(400);
        expect(response.body).toEqual({
          statusCode: 400,
          message: ['description must be shorter than or equal to 200 characters'],
          error: 'Bad Request',
        });
      });
    });

    describe('When send enabled with invalid value', () => {
      test('Then expect a throw Bad Request exception', async () => {
        const params = {
          name: faker.string.alpha(10),
          description: faker.string.alpha(10),
          enabled: 'invalid',
          project: new ObjectId().toHexString(),
        };

        const response = await request(app.getHttpServer()).post('/sub-module/').send(params);

        expect(response.status).toBe(400);
        expect(response.body).toEqual({
          statusCode: 400,
          message: ['enabled must be a boolean value'],
          error: 'Bad Request',
        });
      });
    });

    describe('When send module invalid type object id hex', () => {
      test('Then expect a throw Bad Request exception', async () => {
        const params = {
          name: faker.string.alpha(10),
          description: faker.string.alpha(10),
          enabled: true,
          module: 'invalid-type-object-id-hex',
        };

        const response = await request(app.getHttpServer()).post('/sub-module/').send(params);

        expect(response.status).toBe(400);
        expect(response.body).toEqual({
          statusCode: 400,
          message: ['The property module must be a valid ObjectIdHex'],
          error: 'Bad Request',
        });
      });
    });

    describe('When send module but the db is empty', () => {
      test('Then expect a throw Bad Request exception', async () => {
        const params = {
          name: faker.string.alpha(10),
          description: faker.string.alpha(10),
          enabled: true,
          module: new ObjectId().toHexString(),
        };

        const response = await request(app.getHttpServer()).post('/sub-module/').send(params);

        expect(response.status).toBe(404);
        expect(response.body).toEqual({
          response: 'Module not found',
          status: 404,
          message: 'Module not found',
          name: 'ModuleNotFoundException',
        });
      });
    });
  });
});
