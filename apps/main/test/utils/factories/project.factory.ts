/* eslint-disable hexagonal-architecture/enforce */
import { ProjectEntity } from '@app-main/modules/project/infrastructure/domain/project-muses.entity';
import { faker } from '@faker-js/faker';
import { ObjectId } from 'mongodb';

export function createProjectEntity(params?: Partial<ProjectEntity>): ProjectEntity {
  let projectEntity = new ProjectEntity();

  const defaultProjectEntity = {
    name: faker.string.alpha(10),
    description: faker.string.alpha(10),
    isEnabled: true,
    ecosystem: new ObjectId(),
    modules: null,
  };

  projectEntity = {
    ...projectEntity,
    ...defaultProjectEntity,
    ...params,
  };

  return projectEntity;
}
