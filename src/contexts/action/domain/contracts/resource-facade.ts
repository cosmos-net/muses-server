import { Resource } from '@module-resource/domain/aggregate/resource';

export interface IResourceFacade {
  getResourceById(id: string): Promise<Resource>;
}
