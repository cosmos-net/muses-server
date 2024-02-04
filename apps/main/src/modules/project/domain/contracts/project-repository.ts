import { IProject, Project } from '@module-project/domain/aggregate/project.aggregate';

export interface IProjectRepository {
  persist(model: Project): Promise<IProject>;
}
