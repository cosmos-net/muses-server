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

describe('Delete sub module test persistence', () => {
  let moduleFixture: TestingModule;
  let app: INestApplication;
  let moduleRepository: MongoRepository<ModuleEntity>;
  let subModuleRepository: MongoRepository<SubModuleEntity>;

  beforeAll(async () => {
    moduleFixture = await ModuleFactory.createModule();
    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true, forbidNonWhitelisted: true }));

    moduleRepository = moduleFixture.get<MongoRepository<ModuleEntity>>(getRepositoryToken(ModuleEntity));
    subModuleRepository = moduleFixture.get<MongoRepository<SubModuleEntity>>(getRepositoryToken(SubModuleEntity));

    app.init();

    await moduleRepository.delete({});
    await subModuleRepository.delete({});
  });

  afterAll(async () => {
    if (app) await app.close();
  });

  beforeEach(async () => {
    await moduleRepository.delete({});
    await subModuleRepository.delete({});
  });

  jest.setTimeout(99999999);

  describe('Given we want to delete a submodule', () => {
    describe('When send a submodule id validate but module is not valid', () => {
      test('Then expect a not found exception', async () => {
        const moduleGenerator = await createModuleGenerator(moduleRepository);
        const subModule = await createSubModuleGenerator(subModuleRepository, {
          module: moduleGenerator._id,
        });

        const response = await request(app.getHttpServer()).delete(`/sub-module/${subModule._id.toHexString()}`);

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
          success: true,
          message: `SubModule with id ${subModule._id.toHexString()} has been deleted`,
        });

        const subModuleFound = await subModuleRepository.findOne({
          where: { _id: subModule._id },
          withDeleted: true,
        });

        expect(subModuleFound).toHaveProperty('deletedAt');
        expect(subModuleFound).toHaveProperty('isEnabled', false);
      });
    });
  });
});
