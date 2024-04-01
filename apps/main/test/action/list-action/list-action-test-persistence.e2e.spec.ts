/* eslint-disable hexagonal-architecture/enforce */
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { TestingModule } from '@nestjs/testing';
import { ModuleFactory } from '@test-muses/utils/config/module-factory';
import * as request from 'supertest';
import { MongoRepository } from 'typeorm';
import { ModuleEntity } from '@module-module/infrastructure/domain/module-muses.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { createModuleGenerator } from '@test-muses/utils/generators/module.generator';
import { ActionEntity } from '@module-action/infrastructure/domain/action-muses.entity';
import { SubModuleEntity } from '@module-sub-module/infrastructure/domain/sub-module-muses.entity';
import { createSubModuleGenerator } from '@test-muses/utils/generators/sub-module.generator';
import { createActionGenerator } from '@test-muses/utils/generators/action.generator';

describe('Get list action test persistence (e2e)', () => {
  let moduleFixture: TestingModule;
  let app: INestApplication;

  let moduleRepository: MongoRepository<ModuleEntity>;
  let modelRepository: MongoRepository<ActionEntity>;
  let subModuleRepository: MongoRepository<SubModuleEntity>;

  beforeAll(async () => {
    moduleFixture = await ModuleFactory.createModule();

    app = moduleFixture.createNestApplication();

    app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true, forbidNonWhitelisted: true }));

    modelRepository = moduleFixture.get<MongoRepository<ActionEntity>>(getRepositoryToken(ActionEntity));
    moduleRepository = moduleFixture.get<MongoRepository<ModuleEntity>>(getRepositoryToken(ModuleEntity));
    subModuleRepository = moduleFixture.get<MongoRepository<SubModuleEntity>>(getRepositoryToken(SubModuleEntity));

    await app.init();

    await modelRepository.delete({});
    await moduleRepository.delete({});
    await subModuleRepository.delete({});
  });

  afterAll(async () => {
    await modelRepository.delete({});
    await moduleRepository.delete({});
    await subModuleRepository.delete({});
    if (app) await app.close();
  });

  beforeEach(async () => {
    await modelRepository.delete({});
    await moduleRepository.delete({});
    await subModuleRepository.delete({});
  });

  jest.setTimeout(99999999);

  describe('Given we want to get an action', () => {
    describe('When exist action in db', () => {
      test('Then expect to return a 200 status code', async () => {
        const module = await createModuleGenerator(moduleRepository);
        const subModule = await createSubModuleGenerator(subModuleRepository);
        const action = await createActionGenerator(modelRepository, {
          modules: [module._id],
          subModules: [subModule._id],
        });

        const response = await request(app.getHttpServer()).get('/action/list');

        expect(response.status).toBe(200);
        expect(response.body.items[0].id).toBe(action._id.toHexString());
        expect(response.body.items[0].name).toBe(action.name);
        expect(response.body.items[0].description).toBe(action.description);
        expect(response.body.items[0].isEnabled).toBe(action.isEnabled);
      });
    });
  });
});
