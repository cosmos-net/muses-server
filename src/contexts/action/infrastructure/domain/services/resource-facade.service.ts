import { IResourceFacade } from '@module-action/domain/contracts/resource-facade';
import { Resource } from '@module-resource/domain/aggregate/resource';
import { ResourceModuleFacade } from '@module-resource/infrastructure/api-facade/resource-module.facade';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ResourceFacadeService implements IResourceFacade {
  constructor(private resourceModuleFacade: ResourceModuleFacade) {}

  async getResourceById(id: string): Promise<Resource> {
    const getResourceService = this.resourceModuleFacade.getResourceServiceInstance();
    const resource = await getResourceService.process({ id, withDisabled: true });

    return resource;
  }
}
