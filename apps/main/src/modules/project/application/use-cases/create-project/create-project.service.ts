import { IApplicationServiceCommand } from '@lib-commons/application';
import { Inject, Injectable } from '@nestjs/common';
import { CreateProjectCommand } from '@app-main/modules/project/application/use-cases/create-project/create-project.command';
import { IProjectRepository } from '@app-main/modules/project/domain/contracts/project-repository';
import { Project } from '@app-main/modules/project/domain/aggregate/project.aggregate';
import { IEcosystemModuleFacade } from '@app-main/modules/project/domain/contracts/ecosystem-module-facade';
import {
  ECOSYSTEM_MODULE_FACADE,
  PROJECT_REPOSITORY,
} from '@app-main/modules/project/application/constants/injection-token';

@Injectable()
export class CreateProjectService implements IApplicationServiceCommand<CreateProjectCommand> {
  constructor(
    @Inject(PROJECT_REPOSITORY)
    private projectRepository: IProjectRepository,
    @Inject(ECOSYSTEM_MODULE_FACADE)
    private ecosystemModuleFacade: IEcosystemModuleFacade,
  ) {}

  async process<T extends CreateProjectCommand>(command: T): Promise<Project> {
    const { name, description, ecosystem, enabled } = command;

    const project = new Project();

    project.describe(name, description);

    if (!enabled) {
      project.disabled();
    }

    if (ecosystem) {
      const ecosystemModel = await this.ecosystemModuleFacade.getEcosystemById(ecosystem);
      project.useEcosystem(ecosystemModel);
    }

    await this.projectRepository.persist(project);

    return project;
  }
}
