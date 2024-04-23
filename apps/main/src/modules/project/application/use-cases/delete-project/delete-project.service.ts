import { IApplicationServiceCommand } from '@lib-commons/application/application-service-command';
import { Inject, Injectable } from '@nestjs/common';
import { DeleteProjectCommand } from '@module-project/application/use-cases/delete-project/delete-project.command';
import { IProjectRepository } from '@module-project/domain/contracts/project-repository';
import { PROJECT_REPOSITORY } from '@module-project/application/constants/injection-token';
import { ProjectNotFoundException } from '@module-project/domain/exceptions/project-not-found.exception';
import { UpdateRelationsWithEcosystemEventBody } from '@app-main/modules/project/domain/events/update-relation-with-ecosystem-event/update-relation-with-ecosystem-event-body';
import { UpdateRelationWithEcosystemEvent } from '@app-main/modules/project/domain/events/update-relation-with-ecosystem-event/update-relation-with-ecosystem.event';
import { EventStoreService } from '@lib-commons/application/event-store.service';

@Injectable()
export class DeleteProjectService implements IApplicationServiceCommand<DeleteProjectCommand> {
  constructor(
    @Inject(PROJECT_REPOSITORY)
    private projectRepository: IProjectRepository,
    private readonly eventStoreService: EventStoreService,
  ) {}

  async process<T extends DeleteProjectCommand>(command: T): Promise<number> {
    const { id } = command;

    const project = await this.projectRepository.searchOneBy(id, true);

    if (!project) {
      throw new ProjectNotFoundException();
    }

    project.disable();

    await this.projectRepository.persist(project);

    if (project.ecosystemId) {
      await this.tryToEmitEvent({
        ecosystemToRelateProject: '',
        ecosystemToUnRelateProject: project.ecosystemId,
        projectId: project.id,
      });
    }

    return 1;
  }

  private async tryToEmitEvent(
    updateRelationsWithEcosystemEventBody: UpdateRelationsWithEcosystemEventBody,
  ): Promise<void> {
    const event = new UpdateRelationWithEcosystemEvent(updateRelationsWithEcosystemEventBody);
    await this.eventStoreService.emit(event);
  }
}
