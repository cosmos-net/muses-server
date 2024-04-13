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
import { ObjectId } from 'mongodb';
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
    describe('When we send a valid params with actions and trigger', () => {
      test('Then expect an resource created', async () => {
        const actions: ActionEntity[] = [];
        const triggers: ResourceEntity[] = [];

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        for await (const _ of Array(2)) {
          const action = await createActionGenerator(actionRepository);
          const resource = await createResourceGenerator(resourceRepository);

          actions.push(action);
          triggers.push(resource);
        }

        const parseToHexString = (values: any[]) => values.map((value) => value._id.toHexString());

        const params = {
          name: faker.string.alpha(10),
          description: faker.string.alpha(10),
          isEnabled: true,
          endpoint: faker.internet.url(),
          method: 'POST',
          actions: parseToHexString(actions),
          triggers: parseToHexString(triggers),
        };

        const response = await request(app.getHttpServer()).post('/resource').send(params);

        expect(response.status).toBe(201);
        expect(response.body.name).toBe(params.name);
        expect(response.body.description).toBe(params.description);
        expect(response.body.isEnabled).toBe(params.isEnabled);
        expect(response.body.actions.length).toBe(params.actions.length);
        expect(response.body.triggers.length).toBe(params.triggers.length);

        const resourceFound = await resourceRepository.findOne({
          where: { _id: new ObjectId(response.body.id) },
        });

        if (!resourceFound) {
          throw new Error('Resource not found');
        }

        if (!resourceFound.actions) {
          throw new Error('Resource actions not found');
        }

        expect(resourceFound.actions.length).toBe(response.body.actions.length);
        expect(resourceFound.actions.length).toBe(params.actions.length);

        const actionsFound = await actionRepository.find({
          where: { _id: { $in: response.body.actions.map((action: any) => new ObjectId(action)) } },
        });

        expect(actionsFound.length).toBe(response.body.actions.length);

        for (const action of actionsFound) {
          expect(action.resource.toHexString()).toBe(response.body.id);
        }
      });

      describe('When we send a valid params with actions', () => {
        test('Then expect an resource created', async () => {
          const actions: ActionEntity[] = [];

          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          for await (const _ of Array(2)) {
            const action = await createActionGenerator(actionRepository);

            actions.push(action);
          }

          const parseToHexString = (values: any[]) => values.map((value) => value._id.toHexString());

          const params = {
            name: faker.string.alpha(10),
            description: faker.string.alpha(10),
            isEnabled: true,
            endpoint: faker.internet.url(),
            method: 'POST',
            actions: parseToHexString(actions),
          };

          const response = await request(app.getHttpServer()).post('/resource').send(params);

          expect(response.status).toBe(201);
          expect(response.body.name).toBe(params.name);
          expect(response.body.description).toBe(params.description);
          expect(response.body.isEnabled).toBe(params.isEnabled);
          expect(response.body.actions.length).toBe(params.actions.length);
          expect(response.body.triggers).toBe(undefined);

          const resourceFound = await resourceRepository.findOne({
            where: { _id: new ObjectId(response.body.id) },
          });

          if (!resourceFound) {
            throw new Error('Resource not found');
          }

          if (!resourceFound.actions) {
            throw new Error('Resource actions not found');
          }

          expect(resourceFound.actions.length).toBe(response.body.actions.length);
          expect(resourceFound.triggers?.length).toBe(undefined);

          const actionsFound = await actionRepository.find({
            where: { _id: { $in: response.body.actions.map((action: any) => new ObjectId(action)) } },
          });

          expect(actionsFound.length).toBe(response.body.actions.length);

          for (const action of actionsFound) {
            expect(action.resource.toHexString()).toBe(response.body.id);
          }
        });
      });

      describe('When we send a invalid params with actions faker', () => {
        test('Then expect an error not found actions', async () => {
          const params = {
            name: faker.string.alpha(10),
            description: faker.string.alpha(10),
            isEnabled: true,
            endpoint: faker.internet.url(),
            method: 'POST',
            actions: [new ObjectId().toHexString(), new ObjectId().toHexString(), new ObjectId().toHexString()],
          };

          const response = await request(app.getHttpServer()).post('/resource').send(params);
          expect(response.status).toBe(404);
        });
      });

      describe('When we send a invalid params with triggers faker', () => {
        test('Then expect an error not found triggers', async () => {
          const actions: ActionEntity[] = [];

          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          for await (const _ of Array(2)) {
            const action = await createActionGenerator(actionRepository);

            actions.push(action);
          }

          const parseToHexString = (values: any[]) => values.map((value) => value._id.toHexString());

          const params = {
            name: faker.string.alpha(10),
            description: faker.string.alpha(10),
            isEnabled: true,
            endpoint: faker.internet.url(),
            method: 'POST',
            actions: parseToHexString(actions),
            triggers: [new ObjectId().toHexString(), new ObjectId().toHexString(), new ObjectId().toHexString()],
          };

          const response = await request(app.getHttpServer()).post('/resource').send(params);
          expect(response.status).toBe(404);
        });
      });
    });
  });
});
