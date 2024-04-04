import { Resource } from '@module-resource/domain/aggregate/resource';
import { ListResource } from '@module-resource/domain/aggregate/list-resource';

export interface IResourceRepository {
  searchListBy(ids: string[]): Promise<ListResource>;
  searchOneBy(
    id: string,
    options: {
      withDeleted: boolean;
    },
  ): Promise<Resource | null>;
}
