/* eslint-disable hexagonal-architecture/enforce */
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { TestingModule } from '@nestjs/testing';
import { ModuleFactory } from '@test-muses/utils/config/module-factory';
import * as request from 'supertest';
import { MongoRepository } from 'typeorm';
import { ModuleEntity } from '@module-module/infrastructure/domain/module-muses.entity';
import { ProjectEntity } from '@module-project/infrastructure/domain/project-muses.entity';
import { createProjectGenerator } from '@test-muses/utils/generators/project.generator';
import { getRepositoryToken } from '@nestjs/typeorm';
import { createModuleGenerator } from '@test-muses/utils/generators/module.generator';

describe('Get list module test persistence (e2e)', () => {
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

  describe('Given we want to get a module', () => {
    describe('When exist modules in db', () => {
      test('Then expect to return a 200 status code', async () => {
        const project = await createProjectGenerator(projectRepository);
        const module = await createModuleGenerator(modelRepository, {
          project: project._id,
        });

        const response = await request(app.getHttpServer()).get('/module/list');

        expect(response.status).toBe(200);

        expect(response.body.items[0].id).toBe(module._id.toHexString());
        expect(response.body.items[0].name).toBe(module.name);
        expect(response.body.items[0].description).toBe(module.description);
        expect(response.body.items[0].isEnabled).toBe(module.isEnabled);

        expect(response.body.items[0].projectId).toBe(project._id.toHexString());
      });
    });
  });
});
