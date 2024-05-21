/* eslint-disable hexagonal-architecture/enforce */
// eslint-disable-next-line hexagonal-architecture/enforce
import { ModuleEntity } from '@module-module/infrastructure/domain/module-muses.entity';
import { SubModuleEntity } from '@module-sub-module/infrastructure/domain/sub-module-muses.entity';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ModuleFactory } from '@test/utils/config/module-factory';
import { createModuleGenerator } from '@test/utils/generators/module.generator';
import { createSubModuleGenerator } from '@test/utils/generators/sub-module.generator';
import * as request from 'supertest';
import { MongoRepository } from 'typeorm';

describe('Get submodule test persistence (e2e)', () => {
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

    await modelRepository.delete({});
    await moduleRepository.delete({});
  });

  afterAll(async () => {
    await modelRepository.delete({});
    await moduleRepository.delete({});
    if (app) await app.close();
  });

  beforeEach(async () => {
    await modelRepository.delete({});
    await moduleRepository.delete({});
  });

  jest.setTimeout(99999999);

  describe('Given we want to get an submodule', () => {
    describe('When exist submodule in db', () => {
      test('Then expect to return a 200 status code', async () => {
        const module = await createModuleGenerator(moduleRepository);
        const subModule = await createSubModuleGenerator(modelRepository, {
          module: module._id,
        });

        const response = await request(app.getHttpServer()).get(`/sub-module/${subModule._id}?withDisabled=true`);

        expect(response.status).toBe(200);
        expect(response.body.id).toBe(subModule._id.toHexString());
        expect(response.body.name).toBe(subModule.name);
        expect(response.body.description).toBe(subModule.description);
      });
    });
  });
});
