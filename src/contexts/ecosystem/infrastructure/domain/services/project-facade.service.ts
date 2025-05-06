import { ProjectModuleFacade } from '@module-project/infrastructure/api-facade/project-module.facade';
import { IProjectFacade } from '@context-ecosystem/domain/contracts/project-facade';
import { Injectable } from '@nestjs/common';
import { Project } from '@module-project/domain/aggregate/project';

@Injectable()
export class ProjectFacadeService implements IProjectFacade {
  constructor(private readonly projectModuleFacade: ProjectModuleFacade) {}

  async getProjectById(id: string): Promise<Project> {
    return this.projectModuleFacade.retrieveProject({
      id,
      withDisabled: true,
    });
  }
}
