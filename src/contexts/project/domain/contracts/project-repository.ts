import { Criteria } from '@core/domain/criteria/criteria';
import { Project } from '@module-project/domain/aggregate/project';
import { ListProject } from '@module-project/domain/aggregate/list-project';

export interface IProjectRepository {
  persist(model: Project): Promise<Project>;
  softDeleteBy(project: Project): Promise<number | undefined>;
  searchListBy(criteria: Criteria): Promise<ListProject>;
  isNameAvailable(name: string): Promise<boolean>;
  removeEcosystem(projectId: string, ecosystem: string): Promise<void>;
  searchOneBy(id: string, withDeleted: boolean): Promise<Project | null>;
}
