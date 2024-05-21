/* eslint-disable hexagonal-architecture/enforce */
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { TestingModule } from '@nestjs/testing';
import { ModuleFactory } from '@test/utils/config/module-factory';
import * as request from 'supertest';
import { faker } from '@faker-js/faker';
import { MongoRepository } from 'typeorm';
import { ModuleEntity } from '@module-module/infrastructure/domain/module-muses.entity';
import { SubModuleEntity } from '@module-sub-module/infrastructure/domain/sub-module-muses.entity';
import { createModuleGenerator } from '@test/utils/generators/module.generator';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('Create submodule test persistence (e2e)', () => {
  let moduleFixture: TestingModule;
  let app: INestApplication;

  let modelRepository: MongoRepository<SubModuleEntity>;
  let moduleRepository: MongoRepository<ModuleEntity>;

  beforeAll(async () => {
    moduleFixture = await ModuleFactory.createModule();

    app = moduleFixture.createNestApplication();

    app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true, forbidNonWhitelisted: true }));

    modelRepository = moduleFixture.get<MongoRepository<SubModuleEntity>>(getRepositoryToken(SubModuleEntity));
    moduleRepository = moduleFixture.get<MongoRepository<ModuleEntity>>(getRepositoryToken(ModuleEntity));

    await app.init();

    await moduleRepository.delete({});
    await modelRepository.delete({});
  });

  afterAll(async () => {
    await moduleRepository.delete({});
    await modelRepository.delete({});
    if (app) await app.close();
  });

  beforeEach(async () => {
    await moduleRepository.delete({});
    await modelRepository.delete({});
  });

  jest.setTimeout(99999999);

  describe('Given we want to create a submodule', () => {
    describe('When send a module validate', () => {
      test('Then expect a submodule created', async () => {
        const module = await createModuleGenerator(moduleRepository);

        const params = {
          name: faker.string.alpha(10),
          description: faker.string.alpha(10),
          enabled: true,
          module: module._id.toHexString(),
        };

        const response = await request(app.getHttpServer()).post('/sub-module/').send(params);

        expect(response.status).toBe(201);
        expect(response.body.name).toBe(params.name);
        expect(response.body.description).toBe(params.description);
        expect(response.body.project.id).toBe(params.module);

        const moduleFound = await moduleRepository.findOneBy({
          _id: module._id.toHexString(),
        });

        if (!moduleFound) throw new Error('Module not found');

        expect(moduleFound.subModules).toHaveLength(1);
        expect(moduleFound.subModules[0]).toEqual(response.body.id);
      });
    });
  });
});
