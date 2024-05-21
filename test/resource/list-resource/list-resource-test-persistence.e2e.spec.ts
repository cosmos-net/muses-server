// eslint-disable-next-line hexagonal-architecture/enforce
import { ResourceEntity } from '@module-resource/infrastructure/domain/resources-muses.entity';
import { ActionEntity } from '@module-action/infrastructure/domain/action-muses.entity';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ModuleFactory } from '@test/utils/config/module-factory';
import { createActionGenerator } from '@test/utils/generators/action.generator';
import { createResourceGenerator } from '@test/utils/generators/resource.generator';
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
        const resourceTrigger = await createResourceGenerator(resourceRepository);

        const resourceWithTrigger = await createResourceGenerator(resourceRepository, {
          actions: [action._id],
          triggers: [resourceTrigger._id],
        });

        const response = await request(app.getHttpServer()).get('/resource/list');
        expect(response.status).toBe(200);

        const resourcesFound = await resourceRepository.find({
          where: { _id: { $in: [resourceWithTrigger._id, resourceTrigger._id] } },
          withDeleted: false,
        });

        for (const item of response.body.items) {
          const resource = resourcesFound.find((resource) => resource._id.toHexString() === item.id);
          expect(resource).toBeDefined();
        }
      });
    });

    describe('When exist more than 10 resource in db', () => {
      test('Then expect to return a 200 status code and 10 items', async () => {
        for (let i = 0; i < 15; i++) {
          const action = await createActionGenerator(actionRepository);
          const resource = await createResourceGenerator(resourceRepository);
          await createResourceGenerator(resourceRepository, {
            actions: [action._id],
            triggers: [resource._id],
          });
        }

        const response = await request(app.getHttpServer()).get('/resource/list');
        expect(response.status).toBe(200);
        expect(response.body.items.length).toBe(10);
      });
    });

    describe('When exist less than 5 resource in db', () => {
      test('Then expect to return a 200 status code and 4 items', async () => {
        const quantity = 5;

        for (let i = 0; i < quantity; i++) {
          const action = await createActionGenerator(actionRepository);
          await createResourceGenerator(resourceRepository, {
            actions: [action._id],
          });
        }

        const response = await request(app.getHttpServer()).get('/resource/list');

        expect(response.status).toBe(200);
        expect(response.body.items.length).toBe(quantity);
      });
    });

    describe('When does not exist registers in db of resources', () => {
      test('Then expect to return a 200 status code and 0 items', async () => {
        const response = await request(app.getHttpServer()).get('/resource/list');
        expect(response.status).toBe(200);
        expect(response.body.items.length).toBe(0);
      });
    });
  });
});
