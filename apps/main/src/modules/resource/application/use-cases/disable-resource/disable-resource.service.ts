import { IApplicationServiceCommand } from '@lib-commons/application/application-service-command';
import { Inject, Injectable } from '@nestjs/common';
import { DisableResourceCommand } from '@module-resource/application/use-cases/disable-resource/disable-resource.command';
import { IResourceRepository } from '@module-resource/domain/contracts/resource-repository';
import { RESOURCE_REPOSITORY } from '@module-resource/application/constants/injection-token';
import { ResourceNotFoundException } from '@app-main/modules/resource/domain/exceptions/resource-not-found.exception';
import { UpdateRelationsWithActionEventBody } from '@app-main/modules/resource/domain/events/update-relation-with-action-event/update-relation-with-action-event-body';
import { UpdateRelationWithActionEvent } from '@app-main/modules/resource/domain/events/update-relation-with-action-event/update-relation-with-action.event';
import { EventStoreService } from '@lib-commons/application/event-store.service';

@Injectable()
export class DisableResourceService implements IApplicationServiceCommand<DisableResourceCommand> {
  constructor(
    @Inject(RESOURCE_REPOSITORY)
    private resourceRepository: IResourceRepository,
    private readonly eventStoreService: EventStoreService,
  ) {}

  async process<T extends DisableResourceCommand>(command: T): Promise<number | undefined> {
    const { id } = command;

    const resource = await this.resourceRepository.searchOneBy(id, {
      withDeleted: true,
    });

    if (!resource) {
      throw new ResourceNotFoundException();
    }

    resource.disable();

    await this.resourceRepository.persist(resource);

    if (resource.actionsIds.length > 0) {
      await this.tryToEmitEvent({
        resourceId: resource.id,
        actionsToRemoveResource: resource.actionsIds,
        actionsToAddResource: [],
      });
    }

    return 1;
  }

  private async tryToEmitEvent(updateRelationsWithActionEventBody: UpdateRelationsWithActionEventBody): Promise<void> {
    const event = new UpdateRelationWithActionEvent(updateRelationsWithActionEventBody);
    await this.eventStoreService.emit(event);
  }
}
