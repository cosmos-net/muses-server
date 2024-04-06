/* eslint-disable hexagonal-architecture/enforce */
import { faker } from '@faker-js/faker';
import { ActionEntity } from '@module-action/infrastructure/domain/action-muses.entity';
import { ResourceEntity } from '@module-resource/infrastructure/domain/resources-muses.entity';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ModuleFactory } from '@test-muses/utils/config/module-factory';
import { createActionGenerator } from '@test-muses/utils/generators/action.generator';
import { createResourceGenerator } from '@test-muses/utils/generators/resource.generator';
import * as request from 'supertest';
import { MongoRepository } from 'typeorm';

describe('Create resource test persistence (e2e)', () => {
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

  describe('Given we want to create a resource', () => {
    describe('When we send a list of actions and triggers valid', () => {
      test('Then expect an resource created', async () => {
        const action = await createActionGenerator(actionRepository);
        const resource = await createResourceGenerator(resourceRepository);
        const params = {
          name: faker.string.alpha(10),
          description: faker.string.alpha(10),
          isEnabled: true,
          endpoint: faker.internet.url(),
          method: 'POST',
          actions: [action._id.toHexString()],
          triggers: [resource._id.toHexString()],
        };

        const response = await request(app.getHttpServer()).post('/resource').send(params);

        expect(response.status).toBe(201);
        expect(response.body.name).toBe(params.name);
        expect(response.body.description).toBe(params.description);
        expect(response.body.isEnabled).toBe(params.isEnabled);
        expect(response.body.actions[0]).toBe(action._id.toHexString());
        expect(response.body.triggers[0]).toBe(resource._id.toHexString());
      });
    });
  });
});
