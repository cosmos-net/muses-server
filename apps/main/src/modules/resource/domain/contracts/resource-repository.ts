import { Resource } from '@module-resource/domain/aggregate/resource';
import { ListResource } from '@module-resource/domain/aggregate/list-resource';
import { Criteria } from '@lib-commons/domain/criteria/criteria';

export interface IResourceRepository {
  persist(resource: Resource): Promise<Resource>;
  isNameAvailable(name: string): Promise<boolean>;
  searchListBy(criteria: Criteria): Promise<ListResource>;
  searchListBy(ids: string[], withDeleted?: boolean): Promise<ListResource>;
  searchOneBy(
    id: string,
    options: {
      withDeleted: boolean;
    },
  ): Promise<Resource | null>;
}
