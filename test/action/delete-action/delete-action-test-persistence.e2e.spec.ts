/* eslint-disable hexagonal-architecture/enforce */
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { TestingModule } from '@nestjs/testing';
import { ModuleFactory } from '@test/utils/config/module-factory';
import * as request from 'supertest';
import { SubModuleEntity } from '@module-sub-module/infrastructure/domain/sub-module-muses.entity';
import { ModuleEntity } from '@module-module/infrastructure/domain/module-muses.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { createSubModuleGenerator } from '@test/utils/generators/sub-module.generator';
import { createModuleGenerator } from '@test/utils/generators/module.generator';
import { ActionEntity } from '@module-action/infrastructure/domain/action-muses.entity';
import { createActionGenerator } from '@test/utils/generators/action.generator';

describe('Delete action test persistence', () => {
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

    app.init();

    await modelRepository.delete({});
    await moduleRepository.delete({});
    await subModuleRepository.delete({});
  });

  afterAll(async () => {
    if (app) await app.close();
  });

  beforeEach(async () => {
    await modelRepository.delete({});
    await moduleRepository.delete({});
    await subModuleRepository.delete({});
  });

  jest.setTimeout(99999999);

  describe('Given we want to delete an action', () => {
    describe('When send an action id validate', () => {
      test('Then expect an action deleted', async () => {
        const module = await createModuleGenerator(moduleRepository);
        const subModule = await createSubModuleGenerator(subModuleRepository);
        const action = await createActionGenerator(modelRepository, {
          modules: [module._id],
          subModules: [subModule._id],
        });

        const response = await request(app.getHttpServer()).delete(`/actions/${action._id}`);

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
          success: true,
          message: `Action with id ${action._id} has been deleted`,
        });

        const actionFound = await modelRepository.findOne({
          where: { _id: action._id },
          withDeleted: true,
        });

        expect(actionFound).toHaveProperty('deletedAt');
        expect(actionFound).toHaveProperty('isEnabled', false);
      });
    });
  });
});
