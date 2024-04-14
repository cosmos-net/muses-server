/* eslint-disable hexagonal-architecture/enforce */
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

describe('Update resource test persistence (e2e)', () => {
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

  describe('Given we want to update a resource', () => {
    describe('When we send a list of actions valid', () => {
      test('Then expect to update the resource', async () => {
        const action = await createActionGenerator(actionRepository);
        const resource = await createResourceGenerator(resourceRepository, {
          actions: [action._id],
        });

        const action2 = await createActionGenerator(actionRepository);

        const params = {
          id: resource._id.toHexString(),
          actions: [action2._id.toHexString()],
        };

        const response = await request(app.getHttpServer())
          .patch('/resource')
          .send({ id: params.id, actions: params.actions });

        expect(response.status).toBe(200);
        expect(response.body.name).toBe(resource.name);
        expect(response.body.description).toBe(resource.description);
        expect(response.body.actions[0].id).toBe(action2._id.toHexString());

        const resourceFound = await resourceRepository.findOne({
          where: { _id: resource._id },
          withDeleted: true,
        });

        if (resourceFound?.actions) {
          expect(resourceFound.actions[0].toHexString()).toBe(action2._id.toHexString());
        } else {
          if (!resourceFound?.actions) {
            fail('Resource not found');
          }
        }
      });

      describe('When we send a list of triggers valid', () => {
        test('Then expect to update the resource', async () => {
          const action = await createActionGenerator(actionRepository);
          const resourceTrigger = await createResourceGenerator(resourceRepository);
          const resource = await createResourceGenerator(resourceRepository, {
            triggers: [resourceTrigger._id],
          });

          const resource2 = await createResourceGenerator(resourceRepository);

          const params = {
            id: resource._id.toHexString(),
            triggers: [resource2._id.toHexString()],
            actions: [action._id.toHexString()],
          };

          const response = await request(app.getHttpServer()).patch('/resource').send(params);

          expect(response.status).toBe(200);
          expect(response.body.name).toBe(resource.name);
          expect(response.body.description).toBe(resource.description);
          expect(response.body.triggers[0].id).toBe(resource2._id.toHexString());

          const resourceFound = await resourceRepository.findOne({
            where: { _id: resource._id },
            withDeleted: true,
          });

          if (!resourceFound?.triggers) {
            fail('Resource not found');
          }

          expect(resourceFound.triggers[0].toHexString()).toBe(resource2._id.toHexString());
        });
      });

      describe('When we send a list of triggers empty', () => {
        test('Then expect to update the resource with triggers empty', async () => {
          const action = await createActionGenerator(actionRepository);
          const resourceTrigger = await createResourceGenerator(resourceRepository);
          const resource = await createResourceGenerator(resourceRepository, {
            triggers: [resourceTrigger._id],
          });

          const params = {
            id: resource._id.toHexString(),
            actions: [action._id.toHexString()],
            triggers: [],
          };

          const response = await request(app.getHttpServer()).patch('/resource').send(params);

          expect(response.status).toBe(200);
          expect(response.body.name).toBe(resource.name);
          expect(response.body.description).toBe(resource.description);
          expect(response.body.triggers).toBeUndefined();

          const resourceFound = await resourceRepository.findOne({
            where: { _id: resource._id },
            withDeleted: true,
          });

          if (!resourceFound) {
            fail('Resource not found');
          }

          expect(resourceFound.triggers).toBeNull();
        });
      });

      describe('When I try update a resource with invalid triggers', () => {
        test('Then expect to return a 400 status code', async () => {
          const resource = await createResourceGenerator(resourceRepository);
          const action = await createActionGenerator(actionRepository);

          const params = {
            id: resource._id.toHexString(),
            actions: [action._id.toHexString()],
            triggers: [new ObjectId().toHexString()],
          };

          const response = await request(app.getHttpServer()).patch('/resource').send(params);

          expect(response).toHaveProperty('body', {
            response: 'Triggers not found',
            status: 404,
            message: 'Triggers not found',
            name: 'TriggersNotFoundException',
          });
        });
      });

      describe('When I try update a resource with invalid actions', () => {
        test('Then expect to return a 400 status code', async () => {
          const resource = await createResourceGenerator(resourceRepository);

          const params = {
            id: resource._id.toHexString(),
            actions: [new ObjectId().toHexString()],
          };

          const response = await request(app.getHttpServer())
            .patch('/resource')
            .send({ id: params.id, actions: params.actions });

          expect(response).toHaveProperty('body', {
            response: 'Action not found',
            status: 404,
            message: 'Action not found',
            name: 'ActionNotFoundException',
          });
        });
      });
    });
  });
});
