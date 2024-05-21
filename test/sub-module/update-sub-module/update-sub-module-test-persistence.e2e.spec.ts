/* eslint-disable hexagonal-architecture/enforce */
/* eslint-disable hexagonal-architecture/enforce */
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { TestingModule } from '@nestjs/testing';
import { ModuleFactory } from '@test/utils/config/module-factory';
import * as request from 'supertest';
import { faker } from '@faker-js/faker';
import { MongoRepository } from 'typeorm';
import { SubModuleEntity } from '@module-sub-module/infrastructure/domain/sub-module-muses.entity';
import { ModuleEntity } from '@module-module/infrastructure/domain/module-muses.entity';
import { createModuleGenerator } from '@test/utils/generators/module.generator';
import { getRepositoryToken } from '@nestjs/typeorm';
import { createSubModuleGenerator } from '@test/utils/generators/sub-module.generator';

describe('Update sub-module test persistence (e2e)', () => {
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

  describe('Given we want to update a sub-module', () => {
    describe('When send a module validate', () => {
      test('Then expect a sub-module created', async () => {
        const module = await createModuleGenerator(moduleRepository);
        const submodule = await createSubModuleGenerator(modelRepository, {
          module: module._id,
        });

        const module2 = await createModuleGenerator(moduleRepository);

        const params = {
          id: submodule._id.toHexString(),
          name: faker.string.alpha(10),
          description: faker.string.alpha(10),
          enabled: true,
          module: module2._id.toHexString(),
        };

        const response = await request(app.getHttpServer())
          .patch('/sub-module/')
          .send({ id: params.id, module: params.module });

        expect(response.status).toBe(200);
        expect(response.body.name).toBe(submodule.name);
        expect(response.body.description).toBe(submodule.description);
        expect(response.body.project.id).toBe(params.module);
      });
    });
  });
});
