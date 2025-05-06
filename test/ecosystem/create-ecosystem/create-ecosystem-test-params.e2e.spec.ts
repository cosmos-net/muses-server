/* eslint-disable hexagonal-architecture/enforce */
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { TestingModule } from '@nestjs/testing';
import { ModuleFactory } from '@test/utils/config/module-factory';
import * as request from 'supertest';
import { faker } from '@faker-js/faker';
import { ObjectId } from 'mongodb';

describe('Create ecosystem test params (e2e)', () => {
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

  describe('Given we want to create an ecosystem', () => {
    describe('when send name with length less than 3', () => {
      test('Then expect a throw Bad Request exception', async () => {
        const params = {
          name: faker.string.alpha(2),
          description: faker.string.alpha(10),
          isEnabled: true,
        };

        const response = await request(app.getHttpServer()).post('/ecosystem/').send(params);

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
          isEnabled: true,
        };

        const response = await request(app.getHttpServer()).post('/ecosystem/').send(params);

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
          isEnabled: true,
        };

        const response = await request(app.getHttpServer()).post('/ecosystem/').send(params);

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
          isEnabled: true,
        };

        const response = await request(app.getHttpServer()).post('/ecosystem/').send(params);

        expect(response.status).toBe(400);
        expect(response.body).toEqual({
          statusCode: 400,
          message: ['description must be shorter than or equal to 200 characters'],
          error: 'Bad Request',
        });
      });
    });

    describe('When send isEnabled with invalid value', () => {
      test('Then expect a throw Bad Request exception', async () => {
        const params = {
          name: faker.string.alpha(10),
          description: faker.string.alpha(10),
          isEnabled: 'invalid',
        };

        const response = await request(app.getHttpServer()).post('/ecosystem/').send(params);

        expect(response.status).toBe(400);
        expect(response.body).toEqual({
          statusCode: 400,
          message: ['isEnabled must be a boolean value'],
          error: 'Bad Request',
        });
      });
    });

    describe('When creating an ecosystem with valid parameters', () => {
      test('Then the ecosystem should be created successfully', async () => {
        const params = {
          name: faker.string.alpha(10),
          description: faker.string.alpha(10),
          isEnabled: true,
        };

        const response = await request(app.getHttpServer()).post('/ecosystem/').send(params);

        expect(response.status).toBe(201);
        expect(response.body).toEqual({
          id: expect.any(String),
          name: params.name,
          description: params.description,
          isEnabled: params.isEnabled,
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        });
      });
    });

    describe('When creating an ecosystem with a name that already exists', () => {
      test('Then expect a throw Bad Request exception', async () => {
        // First create an ecosystem with a specific name
        const name = faker.string.alpha(10);
        const firstEcosystemParams = {
          name,
          description: faker.string.alpha(10),
          isEnabled: true,
        };

        await request(app.getHttpServer()).post('/ecosystem/').send(firstEcosystemParams);

        // Try to create another ecosystem with the same name
        const duplicateEcosystemParams = {
          name,
          description: faker.string.alpha(10),
          isEnabled: true,
        };

        const response = await request(app.getHttpServer()).post('/ecosystem/').send(duplicateEcosystemParams);

        expect(response.status).toBe(400);
        expect(response.body.message).toEqual('Ecosystem name already used');
      });
    });
  });
});
