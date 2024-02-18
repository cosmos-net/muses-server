/* eslint-disable hexagonal-architecture/enforce */
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { TestingModule } from '@nestjs/testing';
import { ModuleFactory } from '../utils/module-factory';
import { ProjectEntity } from '@module-project/infrastructure/domain/project-muses.entity';
import { MongoRepository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as request from 'supertest';
import { EcosystemEntity } from '@module-eco/infrastructure/domain/ecosystem-muses.entity';

describe('Create project test (e2e)', () => {
  let moduleFixture: TestingModule;
  let app: INestApplication;

  let projectRepository: MongoRepository<ProjectEntity>;
  let ecosystemRepository: MongoRepository<EcosystemEntity>;

  beforeEach(async () => {
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

  describe('Given a project', () => {
    describe('When the project is deleted', () => {
      test('Then I expect a project disabled', async () => {
        const project = await projectRepository.save({ name: 'Project 1', description: 'Description 1' });

        const response = await request(app.getHttpServer()).get('/project/' + project._id.toHexString());

        expect(response.status).toBe(200);
      });
    });
  });
});
