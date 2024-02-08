import { Criteria } from '@lib-commons/domain/criteria/criteria';
import { Project } from '@app-main/modules/project/domain/aggregate/project';
import { ListProject } from '@module-project/domain/aggregate/list-project';

export interface IProjectRepository {
  persist(model: Project): Promise<Project>;
  softDeleteBy(project: Project): Promise<number | undefined>;
  searchOneBy(id: string): Promise<Project | null>;
  searchListBy(criteria: Criteria): Promise<ListProject>;
  isNameAvailable(name: string): Promise<boolean>;
}
