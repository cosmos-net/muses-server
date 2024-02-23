/* eslint-disable hexagonal-architecture/enforce */
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { TestingModule } from '@nestjs/testing';
import { ModuleFactory } from '../../utils/config/module-factory';
import * as request from 'supertest';
import { faker } from '@faker-js/faker';
import { MongoRepository } from 'typeorm';
import { ModuleEntity } from '@module-module/infrastructure/domain/module-muses.entity';
import { ProjectEntity } from '@module-project/infrastructure/domain/project-muses.entity';
import { createProjectGenerator } from '../../utils/generators/project.generator';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('Create module test persistence (e2e)', () => {
  let moduleFixture: TestingModule;
  let app: INestApplication;

  let modelRepository: MongoRepository<ModuleEntity>;
  let projectRepository: MongoRepository<ProjectEntity>;

  beforeAll(async () => {
    moduleFixture = await ModuleFactory.createModule();

    app = moduleFixture.createNestApplication();

    app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true, forbidNonWhitelisted: true }));

    modelRepository = moduleFixture.get<MongoRepository<ModuleEntity>>(getRepositoryToken(ModuleEntity));
    projectRepository = moduleFixture.get<MongoRepository<ProjectEntity>>(getRepositoryToken(ProjectEntity));

    await app.init();

    await projectRepository.delete({});
    await modelRepository.delete({});
  });

  afterAll(async () => {
    await projectRepository.delete({});
    await modelRepository.delete({});
    if (app) await app.close();
  });

  beforeEach(async () => {
    await projectRepository.delete({});
    await modelRepository.delete({});
  });

  jest.setTimeout(99999999);

  describe('Given we want to create a module', () => {
    describe('When send a project validate', () => {
      test('Then expect a module created', async () => {
        const project = await createProjectGenerator(projectRepository);

        const params = {
          name: faker.string.alpha(10),
          description: faker.string.alpha(10),
          enabled: true,
          project: project._id.toHexString(),
        };

        const response = await request(app.getHttpServer()).post('/module/').send(params);

        expect(response.status).toBe(201);
        expect(response.body.name).toBe(params.name);
        expect(response.body.description).toBe(params.description);
        expect(response.body.project.id).toBe(params.project);
      });
    });
  });
});
