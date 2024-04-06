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

describe('Get list resource test persistence (e2e)', () => {
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

  describe('Given we want to get a list of resources', () => {
    describe('When exist resources in db', () => {
      test('Then expect to return a 200 status code', async () => {
        const action = await createActionGenerator(actionRepository);
        const resource = await createResourceGenerator(resourceRepository, {
          actions: [action._id],
        });

        const response = await request(app.getHttpServer()).get('/resource/list');
        expect(response.status).toBe(200);
        expect(response.body.items[0].id).toBe(resource._id.toHexString());
        expect(response.body.items[0].name).toBe(resource.name);
        expect(response.body.items[0].actions[0]).toBe(action._id.toHexString());
        expect(response.body.items[0].description).toBe(resource.description);
        expect(response.body.items[0].isEnabled).toBe(action.isEnabled);
      });
    });
  });
});
