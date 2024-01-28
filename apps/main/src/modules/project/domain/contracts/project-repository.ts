import { Project } from '@app-main/modules/project/domain/aggregate/project.aggregate';

export interface IProjectRepository {
  persist(model: Project): Promise<Project>;
}
