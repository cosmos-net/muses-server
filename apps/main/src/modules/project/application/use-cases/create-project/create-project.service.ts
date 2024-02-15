import { IApplicationServiceCommand } from '@lib-commons/application';
import { Inject, Injectable } from '@nestjs/common';
import { CreateProjectCommand } from '@module-project/application/use-cases/create-project/create-project.command';
import { IProjectRepository } from '@module-project/domain/contracts/project-repository';
import { Project } from '@module-project/domain/aggregate/project';
import { IEcosystemModuleFacade } from '@module-project/domain/contracts/ecosystem-module-facade';
import { ECOSYSTEM_MODULE_FACADE, PROJECT_REPOSITORY } from '@module-project/application/constants/injection-token';
import { ProjectNameAlreadyUsedException } from '@module-project/domain/exceptions/project-name-already-used.exception';

@Injectable()
export class CreateProjectService implements IApplicationServiceCommand<CreateProjectCommand> {
  constructor(
    @Inject(ECOSYSTEM_MODULE_FACADE)
    private ecosystemModuleFacade: IEcosystemModuleFacade,
    @Inject(PROJECT_REPOSITORY)
    private projectRepository: IProjectRepository,
  ) {}

  async process<T extends CreateProjectCommand>(command: T): Promise<Project> {
    const { name, description, ecosystem, enabled } = command;

    const isNameAvailable = await this.projectRepository.isNameAvailable(name);

    if (!isNameAvailable) {
      throw new ProjectNameAlreadyUsedException();
    }

    const project = new Project();

    project.describe(name, description);

    if (!enabled) {
      project.disable();
    }

    if (ecosystem) {
      const ecosystemModel = await this.ecosystemModuleFacade.getEcosystemById(ecosystem);
      project.useEcosystem({
        id: ecosystemModel.id,
        name: ecosystemModel.name,
        description: ecosystemModel.description,
        isEnabled: ecosystemModel.isEnabled,
        createdAt: ecosystemModel.createdAt,
        updatedAt: ecosystemModel.updatedAt,
        deletedAt: ecosystemModel.deletedAt,
      });
    }

    await this.projectRepository.persist(project);

    return project;
  }
}
