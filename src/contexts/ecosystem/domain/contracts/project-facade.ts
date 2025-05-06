import { Project } from '@module-project/domain/aggregate/project';

export interface IProjectFacade {
  getProjectById(id: string): Promise<Project>;
}
