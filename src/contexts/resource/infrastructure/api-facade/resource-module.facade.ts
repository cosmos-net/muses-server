import { Injectable } from '@nestjs/common';
import { GetResourceService } from '@module-resource/application/use-cases/get-resource/get-resource.service';

@Injectable()
export class ResourceModuleFacade {
  constructor(private readonly getResourceService: GetResourceService) {}

  getResourceServiceInstance(): GetResourceService {
    return this.getResourceService;
  }
}
