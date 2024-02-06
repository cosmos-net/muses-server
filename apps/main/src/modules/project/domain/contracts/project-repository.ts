import { Criteria } from '@lib-commons/domain/criteria/criteria';
import { Project } from '@module-project/domain/aggregate/project.aggregate';
import { ListProject } from '@module-project/domain/aggregate/list-project';

export interface IProjectRepository {
  persist(model: Project): Promise<Project>;
  softDeleteBy(id: string): Promise<number | undefined>;
  searchOneBy(id: string): Promise<Project | null>;
  searchListBy(criteria: Criteria): Promise<ListProject>;
}
