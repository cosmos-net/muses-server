import { Project } from '@app-main/modules/project/domain/aggregate/project.aggregate';

export interface IEcosystemRepository {
  persist(model: Project): Promise<Project>;
}
