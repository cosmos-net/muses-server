import { IApplicationServiceCommand } from '@lib-commons/application/application-service-command';
import { Inject, Injectable } from '@nestjs/common';
import { CreateProjectCommand } from '@module-project/application/use-cases/create-project/create-project.command';
import { IProjectRepository } from '@module-project/domain/contracts/project-repository';
import { Project } from '@module-project/domain/aggregate/project';
import { IEcosystemModuleFacade } from '@module-project/domain/contracts/ecosystem-module-facade';
import { ECOSYSTEM_MODULE_FACADE, PROJECT_REPOSITORY } from '@module-project/application/constants/injection-token';
import { ProjectNameAlreadyUsedException } from '@module-project/domain/exceptions/project-name-already-used.exception';
import { UpdateRelationWithEcosystemEvent } from '@module-project/domain/events/update-relation-with-ecosystem-event/update-relation-with-ecosystem.event';
import { UpdateRelationsWithEcosystemEventBody } from '@module-project/domain/events/update-relation-with-ecosystem-event/update-relation-with-ecosystem-event-body';
import { EventStoreService } from '@lib-commons/application/event-store.service';

@Injectable()
export class CreateProjectService implements IApplicationServiceCommand<CreateProjectCommand> {
  constructor(
    @Inject(ECOSYSTEM_MODULE_FACADE)
    private ecosystemModuleFacade: IEcosystemModuleFacade,
    @Inject(PROJECT_REPOSITORY)
    private projectRepository: IProjectRepository,
    private readonly eventStoreService: EventStoreService,
  ) {}

  async process<T extends CreateProjectCommand>(command: T): Promise<Project> {
    const { name, description, ecosystem, isEnabled } = command;

    const isNameAvailable = await this.projectRepository.isNameAvailable(name);

    if (!isNameAvailable) {
      throw new ProjectNameAlreadyUsedException();
    }

    const project = new Project();

    project.describe(name, description);
    isEnabled === false && project.disable();

    if (ecosystem) {
      const ecosystemModel = await this.ecosystemModuleFacade.getEcosystemById(ecosystem);

      project.useEcosystem(ecosystemModel);
    }

    await this.projectRepository.persist(project);

    if (ecosystem) {
      await this.tryToEmitEvent({
        ecosystemToRelateProject: ecosystem,
        ecosystemToUnRelateProject: '',
        projectId: project.id,
      });
    }

    return project;
  }

  private async tryToEmitEvent(
    updateRelationsWithEcosystemEventBody: UpdateRelationsWithEcosystemEventBody,
  ): Promise<void> {
    const event = new UpdateRelationWithEcosystemEvent(updateRelationsWithEcosystemEventBody);
    await this.eventStoreService.emit(event);
  }
}
