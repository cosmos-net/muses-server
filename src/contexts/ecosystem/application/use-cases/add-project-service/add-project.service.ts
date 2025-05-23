import { IApplicationServiceCommand } from '@core/application/application-service-command';
import { Inject, Injectable } from '@nestjs/common';
import { AddProjectCommand } from '@context-ecosystem/application/use-cases/add-project-service/add-project.command';
import { ECOSYSTEM_REPOSITORY, PROJECT_FACADE } from '@context-ecosystem/application/constants/injection-token';
import { IEcosystemRepository } from '@context-ecosystem/domain/contracts/ecosystem-repository';
import { IProjectFacade } from '@context-ecosystem/domain/contracts/project-facade';

@Injectable()
export class AddProjectService implements IApplicationServiceCommand<AddProjectCommand> {
  constructor(
    @Inject(ECOSYSTEM_REPOSITORY)
    private ecosystemRepository: IEcosystemRepository,
    @Inject(PROJECT_FACADE)
    private projectFacade: IProjectFacade,
  ) {}

  async process<T extends AddProjectCommand>(command: T): Promise<void> {
    const { projectId, ecosystemId } = command;

    if (projectId && ecosystemId) {
      const project = await this.projectFacade.getProjectById(projectId);

      const ecosystem = await this.ecosystemRepository.byIdOrFail(ecosystemId, true);

      ecosystem.addProject(project.id);

      await this.ecosystemRepository.persist(ecosystem);
    }
  }
}
