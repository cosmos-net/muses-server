/* eslint-disable hexagonal-architecture/enforce */
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { TestingModule } from '@nestjs/testing';
import { ProjectEntity } from '@module-project/infrastructure/domain/project-muses.entity';
import { MongoRepository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as request from 'supertest';
import { EcosystemEntity } from '@module-eco/infrastructure/domain/ecosystem-muses.entity';
import { faker } from '@faker-js/faker';
import { ObjectId } from 'mongodb';
import { ModuleFactory } from '@test/utils/config/module-factory';

describe('Create project test (e2e)', () => {
  let moduleFixture: TestingModule;
  let app: INestApplication;

  let projectRepository: MongoRepository<ProjectEntity>;
  let ecosystemRepository: MongoRepository<EcosystemEntity>;

  beforeAll(async () => {
    moduleFixture = await ModuleFactory.createModule();

    projectRepository = moduleFixture.get<MongoRepository<ProjectEntity>>(getRepositoryToken(ProjectEntity));
    ecosystemRepository = moduleFixture.get<MongoRepository<EcosystemEntity>>(getRepositoryToken(EcosystemEntity));

    app = moduleFixture.createNestApplication();

    app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true, forbidNonWhitelisted: true }));

    await app.init();

    await projectRepository.delete({});
    await ecosystemRepository.delete({});
  });

  afterAll(async () => {
    await projectRepository.delete({});
    if (app) await app.close();
  });

  beforeEach(async () => {
    await projectRepository.delete({});
    await ecosystemRepository.delete({});
  });

  jest.setTimeout(99999999);

  describe('Given we want to create a project', () => {
    describe('When send name with length less than 3', () => {
      test('Then expect a throw Bad Request exception', async () => {
        const params = {
          name: faker.string.alpha(2),
          description: faker.string.alpha(10),
          enabled: true,
        };

        const response = await request(app.getHttpServer()).post('/project/').send(params);

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
        };

        const response = await request(app.getHttpServer()).post('/project/').send(params);

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
        };

        const response = await request(app.getHttpServer()).post('/project/').send(params);

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
        };

        const response = await request(app.getHttpServer()).post('/project/').send(params);

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
        };

        const response = await request(app.getHttpServer()).post('/project/').send(params);

        expect(response.status).toBe(400);
        expect(response.body).toEqual({
          statusCode: 400,
          message: ['enabled must be a boolean value'],
          error: 'Bad Request',
        });
      });
    });

    describe('When send ecosystem invalid type object id hex', () => {
      test('Then expect a throw Bad Request exception', async () => {
        const params = {
          name: faker.string.alpha(10),
          description: faker.string.alpha(10),
          enabled: true,
          ecosystem: 'invalid-type-object-id-hex',
        };

        const response = await request(app.getHttpServer()).post('/project/').send(params);

        expect(response.status).toBe(400);
        expect(response.body).toEqual({
          statusCode: 400,
          message: ['The property ecosystem must be a valid ObjectIdHex'],
          error: 'Bad Request',
        });
      });
    });

    describe('When send ecosystem but the db is empty', () => {
      test('Then expect a throw Bad Request exception', async () => {
        const params = {
          name: faker.string.alpha(10),
          description: faker.string.alpha(10),
          enabled: true,
          ecosystem: new ObjectId().toHexString(),
        };

        const response = await request(app.getHttpServer()).post('/project/').send(params);

        expect(response.status).toBe(400);
        expect(response.body.response.message).toEqual('The ecosystem does not exist');
        expect(response.body.response.error).toEqual('Bad Request');
      });
    });
  });
});
