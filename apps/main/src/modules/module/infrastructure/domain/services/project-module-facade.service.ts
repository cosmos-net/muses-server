import { IProjectModuleFacade } from '@module-module/domain/contracts/project-module-facade';
import { ProjectModuleFacade } from '@module-project/infrastructure/api-facade/project-module.facade';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ProjectModuleFacadeService implements IProjectModuleFacade {
  constructor(private readonly projectModuleFacade: ProjectModuleFacade) {}

  async getProjectById(id: string) {
    const project = await this.projectModuleFacade.retrieveProject({ id, withDisabled: true, withEcosystem: false });

    return project;
  }
}
