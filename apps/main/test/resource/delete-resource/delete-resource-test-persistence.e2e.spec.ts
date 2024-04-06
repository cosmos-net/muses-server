// eslint-disable-next-line hexagonal-architecture/enforce
import { ResourceEntity } from '@module-resource/infrastructure/domain/resources-muses.entity';
import { ActionEntity } from '@module-action/infrastructure/domain/action-muses.entity';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ModuleFactory } from '@test-muses/utils/config/module-factory';
import { createActionGenerator } from '@test-muses/utils/generators/action.generator';
import { createResourceGenerator } from '@test-muses/utils/generators/resource.generator';
import * as request from 'supertest';
import { MongoRepository } from 'typeorm';

describe('Delete resource test persistence (e2e)', () => {
  let moduleFixture: TestingModule;
  let app: INestApplication;

  let resourceRepository: MongoRepository<ResourceEntity>;
  let actionRepository: MongoRepository<ActionEntity>;

  beforeAll(async () => {
    moduleFixture = await ModuleFactory.createModule();

    app = moduleFixture.createNestApplication();

    app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true, forbidNonWhitelisted: true }));

    resourceRepository = moduleFixture.get<MongoRepository<ResourceEntity>>(getRepositoryToken(ResourceEntity));
    actionRepository = moduleFixture.get<MongoRepository<ActionEntity>>(getRepositoryToken(ActionEntity));

    await app.init();

    await resourceRepository.delete({});
    await actionRepository.delete({});
  });

  afterAll(async () => {
    await resourceRepository.delete({});
    await actionRepository.delete({});
    if (app) await app.close();
  });

  beforeEach(async () => {
    await resourceRepository.delete({});
    await actionRepository.delete({});
  });

  jest.setTimeout(99999999);

  describe('Given we want to delete a resource', () => {
    describe('When send a valid resource id', () => {
      test('Then expect a deleted resource', async () => {
        const action = await createActionGenerator(actionRepository);
        const resource = await createResourceGenerator(resourceRepository, {
          actions: [action._id],
        });

        const response = await request(app.getHttpServer()).delete(`/resource/${resource._id}`);
        expect(response.status).toBe(200);
        expect(response.body).toEqual({
          success: true,
          message: `Resource with id ${resource._id} has benn deleted `,
        });

        const resourceFound = await resourceRepository.findOne({
          where: { _id: resource._id },
          withDeleted: true,
        });

        expect(resourceFound).toHaveProperty('deletedAt');
        expect(resourceFound).toHaveProperty('isEnabled', false);
      });
    });
  });
});
