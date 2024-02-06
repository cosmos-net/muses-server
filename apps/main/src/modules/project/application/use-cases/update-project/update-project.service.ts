import { IApplicationServiceCommand } from '@lib-commons/application';
import { Inject, Injectable } from '@nestjs/common';
import { UpdateProjectCommand } from '@module-project/application/use-cases/update-project/update-project.command';
import { IProjectRepository } from '@module-project/domain/contracts/project-repository';
import { Project } from '@app-main/modules/project/domain/aggregate/project';
import { IEcosystemModuleFacade } from '@module-project/domain/contracts/ecosystem-module-facade';
import { ECOSYSTEM_MODULE_FACADE, PROJECT_REPOSITORY } from '@module-project/application/constants/injection-token';
import { ProjectNotFoundException } from '@module-project/domain/exceptions/project-not-found.exception';

@Injectable()
export class UpdateProjectService implements IApplicationServiceCommand<UpdateProjectCommand> {
  constructor(
    @Inject(ECOSYSTEM_MODULE_FACADE)
    private ecosystemModuleFacade: IEcosystemModuleFacade,
    @Inject(PROJECT_REPOSITORY)
    private projectRepository: IProjectRepository,
  ) {}

  async process<T extends UpdateProjectCommand>(command: T): Promise<Project> {
    const { id, name, description, enabled, ecosystem } = command;

    const project = await this.projectRepository.searchOneBy(id);

    if (!project) {
      throw new ProjectNotFoundException();
    }

    if (ecosystem) {
      const ecosystemModel = await this.ecosystemModuleFacade.getEcosystemById(ecosystem);
      project.useEcosystem(ecosystemModel);
    }

    // TODO: Remove project from ecosystem only if project has a ecosystem related
    // TODO: Check if the project is related to other ecosystems

    if (name || description) {
      project.redescribe(name, description);
    }

    if (enabled !== undefined) {
      enabled ? project.enable() : project.disable();
    }

    await this.projectRepository.persist(project);

    return project;
  }
}
