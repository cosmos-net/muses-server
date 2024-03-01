/* eslint-disable hexagonal-architecture/enforce */
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { TestingModule } from '@nestjs/testing';
import { ModuleFactory } from '@test-muses/utils/config/module-factory';
import * as request from 'supertest';
import { ObjectId } from 'mongodb';
import { faker } from '@faker-js/faker';

describe('Delete sub module test params', () => {
  let moduleFixture: TestingModule;
  let app: INestApplication;

  beforeAll(async () => {
    moduleFixture = await ModuleFactory.createModule();
    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true, forbidNonWhitelisted: true }));
    app.init();
  });

  afterAll(async () => {
    if (app) await app.close();
  });

  jest.setTimeout(99999999);

  describe('Given we want to delete a submodule', () => {
    describe('When send id with length less than 24', () => {
      test('Then expect a throw Bad Request exception', async () => {
        const response = await request(app.getHttpServer()).delete(`/sub-module/${new ObjectId().toHexString()}`);

        expect(response.status).toBe(404);
        expect(response.body).toEqual({
          response: 'Sub Module not found',
          status: 404,
          message: 'Sub Module not found',
          name: 'SubModuleNotFoundException',
        });
      });
    });

    describe('When send id with format uuid', () => {
      test('Then expect a throw Bad Request exception', async () => {
        const response = await request(app.getHttpServer()).delete(`/sub-module/${faker.string.uuid}`);

        expect(response.status).toBe(400);
        expect(response.body).toEqual({
          statusCode: 400,
          message: ['The property id must be a valid ObjectIdHex'],
          error: 'Bad Request',
        });
      });
    });
  });
});
