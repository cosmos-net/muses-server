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
import { ObjectId } from 'mongodb';

describe('Get resource test persistence (e2e)', () => {
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

  describe('Given we want to get a resource', () => {
    describe('When exist resource in db with actions properties', () => {
      test('Then I expect to return a 200 status code', async () => {
        const action = await createActionGenerator(actionRepository);
        const resource = await createResourceGenerator(resourceRepository, {
          actions: [action._id],
        });

        const response = await request(app.getHttpServer()).get(`/resource/${resource._id}?withDisabled=true`);
        expect(response.status).toBe(200);
        expect(response.body.id).toBe(resource._id.toHexString());
        expect(response.body.name).toBe(resource.name);
        expect(response.body.description).toBe(resource.description);
        expect(response.body.actions[0].id).toBe(action._id.toHexString());

        const resourceFound = await resourceRepository.findOne({
          where: { _id: resource._id },
          withDeleted: true,
        });

        if (!resourceFound || !resourceFound.actions) {
          throw new Error('Resource not found');
        }

        expect(resourceFound).toHaveProperty('name', response.body.name);
        expect(resourceFound).toHaveProperty('description', response.body.description);
        expect(resourceFound).toHaveProperty('isEnabled', response.body.isEnabled);
        expect(resourceFound).toHaveProperty('actions');
        expect(resourceFound.actions[0].toHexString()).toBe(response.body.actions[0].id);
      });
    });

    describe('When exist resource in db without actions and triggers properties', () => {
      test('Then I expect to return a 200 status code', async () => {
        const trigger1 = await createResourceGenerator(resourceRepository);
        const trigger2 = await createResourceGenerator(resourceRepository);

        const action1 = await createActionGenerator(actionRepository);
        const action2 = await createActionGenerator(actionRepository);

        const resource = await createResourceGenerator(resourceRepository, {
          actions: [action1._id, action2._id],
          triggers: [trigger1._id, trigger2._id],
        });

        const response = await request(app.getHttpServer()).get(`/resource/${resource._id}?withDisabled=true`);

        expect(response.status).toBe(200);
        expect(response.body.id).toBe(resource._id.toHexString());
        expect(response.body.name).toBe(resource.name);
        expect(response.body.description).toBe(resource.description);
        expect(response.body.actions[0].id).toBe(action1._id.toHexString());
        expect(response.body.actions[1].id).toBe(action2._id.toHexString());
        expect(response.body.triggers[0].id).toBe(trigger1._id.toHexString());
        expect(response.body.triggers[1].id).toBe(trigger2._id.toHexString());
      });
    });

    describe('When not exists resource in db', () => {
      test('Then I expect to return a 404 status code', async () => {
        const response = await request(app.getHttpServer()).get(`/resource/${new ObjectId()}?withDisabled=true`);

        expect(response).toHaveProperty('body', {
          response: 'Resource not found',
          status: 404,
          message: 'Resource not found',
          name: 'ResourceNotFoundException',
        });
      });
    });
  });
});
