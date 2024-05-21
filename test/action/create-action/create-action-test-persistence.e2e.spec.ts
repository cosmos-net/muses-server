// eslint-disable-next-line hexagonal-architecture/enforce
import { ActionEntity } from '@module-action/infrastructure/domain/action-muses.entity';
import { ModuleEntity } from '@module-module/infrastructure/domain/module-muses.entity';
import { SubModuleEntity } from '@module-sub-module/infrastructure/domain/sub-module-muses.entity';
import { faker } from '@faker-js/faker';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ModuleFactory } from '@test/utils/config/module-factory';
import { createModuleGenerator } from '@test/utils/generators/module.generator';
import { createSubModuleGenerator } from '@test/utils/generators/sub-module.generator';
import * as request from 'supertest';
import { MongoRepository } from 'typeorm';

describe('Create action test persistence (e2e)', () => {
  let moduleFixture: TestingModule;
  let app: INestApplication;

  let modelRepository: MongoRepository<ActionEntity>;
  let moduleRepository: MongoRepository<ModuleEntity>;
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

  describe('Given we want to create an action', () => {
    describe('When send a list of modules valid', () => {
      test('Then expect an action created', async () => {
        const module = await createModuleGenerator(moduleRepository);
        const params = {
          name: faker.string.alpha(10),
          description: faker.string.alpha(10),
          modules: [module._id.toHexString()],
        };

        const response = await request(app.getHttpServer()).post('/actions/').send(params);

        expect(response.status).toBe(201);
        expect(response.body.name).toBe(params.name);
        expect(response.body.description).toBe(params.description);
      });
    });
    describe('When send a list of sub-modules valid', () => {
      test('Then expect an action created', async () => {
        const subModule = await createSubModuleGenerator(subModuleRepository);

        const params = {
          name: faker.string.alpha(10),
          description: faker.string.alpha(10),
          subModules: [subModule._id.toHexString()],
        };

        const response = await request(app.getHttpServer()).post('/actions/').send(params);

        expect(response.status).toBe(201);
        expect(response.body.name).toBe(params.name);
        expect(response.body.description).toBe(params.description);
      });
    });
  });
});
