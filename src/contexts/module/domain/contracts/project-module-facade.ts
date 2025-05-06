import { Project } from '@module-project/domain/aggregate/project';

export interface IProjectModuleFacade {
  getProjectById(id: string): Promise<Project>;
}
