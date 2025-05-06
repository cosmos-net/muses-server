import { Inject, Injectable } from '@nestjs/common';
import { IEcosystemRepository } from '@module-eco/domain/contracts/ecosystem-repository';
import { IApplicationServiceCommand } from '@core/application/application-service-command';
import { ECOSYSTEM_REPOSITORY, PROJECT_FACADE } from '@module-eco/application/constants/injection-token';
import { IProjectFacade } from '@module-eco/domain/contracts/project-facade';
import { RemoveProjectCommand } from '@module-eco/application/use-cases/remove-project-service/remove-project.command';

@Injectable()
export class RemoveProjectService implements IApplicationServiceCommand<RemoveProjectCommand> {
  constructor(
    @Inject(ECOSYSTEM_REPOSITORY)
    private ecosystemRepository: IEcosystemRepository,
    @Inject(PROJECT_FACADE)
    private projectFacade: IProjectFacade,
  ) {}

  async process<T extends RemoveProjectCommand>(command: T): Promise<void> {
    const { projectId, ecosystemId } = command;

    if (projectId && ecosystemId) {
      const project = await this.projectFacade.getProjectById(projectId);

      const ecosystem = await this.ecosystemRepository.byIdOrFail(ecosystemId, true);

      ecosystem.removeProject(project.id);

      await this.ecosystemRepository.persist(ecosystem);
    }
  }
}
