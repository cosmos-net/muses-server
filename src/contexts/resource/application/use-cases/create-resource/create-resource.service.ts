import { IApplicationServiceCommand } from '@core/application/application-service-command';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { CreateResourceCommand } from '@module-resource/application/use-cases/create-resource/create-resource.command';
import { IActionFacade } from '@module-resource/domain/contracts/action-facade';
import { IResourceRepository } from '@module-resource/domain/contracts/resource-repository';
import { RESOURCE_REPOSITORY, FACADE_ACTION } from '@module-resource/application/constants/injection-token';
import { ResourceNameAlreadyUsedException } from '@module-resource/domain/exceptions/resource-name-already-used.exception';
import { Resource } from '@module-resource/domain/aggregate/resource';
import { ActionNotFoundException } from '@module-action/domain/exceptions/action-not-found.exception';
import { TriggersNotFoundException } from '@module-resource/domain/exceptions/triggers-not-found.exception';
import { UpdateRelationsWithActionEventBody } from '@module-resource/domain/events/update-relation-with-action-event/update-relation-with-action-event-body';
import { UpdateRelationWithActionEvent } from '@module-resource/domain/events/update-relation-with-action-event/update-relation-with-action.event';
import { EventStoreService } from '@core/application/event-store.service';

@Injectable()
export class CreateResourceService implements IApplicationServiceCommand<CreateResourceCommand> {
  constructor(
    @Inject(RESOURCE_REPOSITORY)
    private resourceRepository: IResourceRepository,
    @Inject(FACADE_ACTION)
    private actionFacade: IActionFacade,
    private readonly eventStoreService: EventStoreService,
  ) {}

  private resourceModel: Resource;
  private readonly logger = new Logger(CreateResourceService.name);

  async process<T extends CreateResourceCommand>(command: T): Promise<Resource> {
    const { name, description, isEnabled, endpoint, method, triggers, actions } = command;

    const isNameAvailable = await this.resourceRepository.isNameAvailable(name);

    if (!isNameAvailable) {
      throw new ResourceNameAlreadyUsedException();
    }

    const resource = new Resource();

    resource.describe(name, description);
    isEnabled === false && resource.disable();
    resource.configNetwork(endpoint, method);

    this.resourceModel = resource;

    await this.populateTriggers(triggers);
    await this.populateActions(actions);
    await this.resourceRepository.persist(resource);

    await this.tryToEmitEvent({
      actionsToAddResource: resource.actionsIds,
      actionsToRemoveResource: [],
      resourceId: resource.id,
    });

    return resource;
  }

  private async populateTriggers(triggersIds?: string[]): Promise<void> {
    if (triggersIds && triggersIds.length > 0) {
      const triggers = await this.resourceRepository.searchListBy(triggersIds, true);

      if (triggers.totalItems === 0) {
        throw new TriggersNotFoundException();
      }

      if (triggers.totalItems !== triggersIds.length) {
        this.logger.error('Some triggers were not found');
      }

      this.resourceModel.useTriggers(triggers.entities());
    }
  }

  private async populateActions(actionsIds: string[]): Promise<void> {
    if (actionsIds.length > 0) {
      const actions = await this.actionFacade.getActionByIds(actionsIds);

      if (actions.totalItems === 0) {
        throw new ActionNotFoundException();
      }

      if (actions.totalItems !== actionsIds.length) {
        this.logger.error('Some actions were not found');
      }

      this.resourceModel.useActions(actions.entities());
    }
  }

  private async tryToEmitEvent(updateRelationsWithActionEventBody: UpdateRelationsWithActionEventBody): Promise<void> {
    const event = new UpdateRelationWithActionEvent(updateRelationsWithActionEventBody);
    await this.eventStoreService.emit(event);
  }
}
