/* eslint-disable hexagonal-architecture/enforce */
import { Repository } from 'typeorm';
import { ProjectEntity } from '@module-project/infrastructure/domain/project-muses.entity';
import { createProjectEntity } from '@test-muses/utils/factories/project.factory';

export async function createProjectGenerator(repository: Repository<ProjectEntity>, params?: Partial<ProjectEntity>) {
  const entity = createProjectEntity(params);

  const ProjectEntity = await repository.save(entity);

  return ProjectEntity;
}
