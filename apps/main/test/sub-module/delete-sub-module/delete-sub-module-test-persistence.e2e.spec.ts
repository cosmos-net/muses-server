/* eslint-disable hexagonal-architecture/enforce */
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { TestingModule } from '@nestjs/testing';
import { ModuleFactory } from '@test-muses/utils/config/module-factory';
import * as request from 'supertest';
import { ObjectId } from 'mongodb';
import { SubModuleEntity } from '@module-sub-module/infrastructure/domain/sub-module-muses.entity';
import { ModuleEntity } from '@module-module/infrastructure/domain/module-muses.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { faker } from '@faker-js/faker';
import { createSubModuleGenerator } from '@test-muses/utils/generators/sub-module.generator';

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

  // si deshabilito el modulo entonces deberia tener una fecha de eliminacion y con un estado deshabilitado y el modulo que tenia relacionado ya no lo debe de tener

  describe('Given we want to delete a submodule', () => {
    describe('When send a submodule id validate but module is not valid', () => {
      test('Then expect a not found exception', async () => {
        const subModule = await createSubModuleGenerator(subModuleRepository);

        const response = await request(app.getHttpServer()).delete(`/sub-module/${subModule._id.toHexString()}`);

        expect(response.status).toBe(404);
      });
    });
  });
});
