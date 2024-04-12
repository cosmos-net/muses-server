import { Inject, Injectable, Logger } from '@nestjs/common';
import { IApplicationServiceCommand } from '@lib-commons/application/application-service-command';
import { EventStoreService } from '@lib-commons/application/event-store.service';
import { UpdateResourceCommand } from '@module-resource/application/use-cases/update-resource/update-resource.command';
import { FACADE_ACTION, RESOURCE_REPOSITORY } from '@module-resource/application/constants/injection-token';
import { IResourceRepository } from '@module-resource/domain/contracts/resource-repository';
import { IActionFacade } from '@module-resource/domain/contracts/action-facade';
import { ResourceNotFoundException } from '@module-resource/domain/exceptions/resource-not-found.exception';
import { Resource } from '@module-resource/domain/aggregate/resource';
import { ActionNotFoundException } from '@module-action/domain/exceptions/action-not-found.exception';
import { TriggersNotFoundException } from '@module-resource/domain/exceptions/triggers-not-found.exception';
import { Action } from '@module-action/domain/aggregate/action';
import { UpdateRelationsWithActionEventBody } from '@module-resource/domain/events/update-relation-with-action-event/update-relation-with-action-event-body';
import { UpdateRelationWithActionEvent } from '@module-resource/domain/events/update-relation-with-action-event/update-relation-with-action.event';

@Injectable()
export class UpdateResourceService implements IApplicationServiceCommand<UpdateResourceCommand> {
  constructor(
    @Inject(RESOURCE_REPOSITORY)
    private resourceRepository: IResourceRepository,
    @Inject(FACADE_ACTION)
    private actionFacade: IActionFacade,
    private readonly eventStoreService: EventStoreService,
  ) {}

  private readonly logger = new Logger(UpdateResourceService.name);

  private resourceModel: Resource;
  private triggersToAdd: Resource[];
  private triggersToRemove: Resource[];
  private actionsToAdd: Action[];
  private actionsToRemove: Action[];

  async process<T extends UpdateResourceCommand>(command: T): Promise<Resource> {
    const { id, name, description, isEnabled, endpoint, method, triggers, actions } = command;

    const resource = await this.resourceRepository.searchOneBy(id, { withDeleted: true });

    if (!resource) {
      throw new ResourceNotFoundException();
    }

    resource.reDescribe(name, description);

    if (isEnabled !== undefined) {
      isEnabled ? resource.enable() : resource.disable();
    }

    resource.reConfigNetwork(endpoint, method);

    this.resourceModel = resource;

    await this.populateTriggers(triggers);
    await this.populateActions(actions);

    if (this.actionsToAdd || this.actionsToRemove) {
      await this.tryToEmitEvent({
        actionsToAddResource: this.actionsToAdd?.map((action) => action.id),
        actionsToRemoveResource: this.actionsToRemove?.map((action) => action.id),
        resourceId: resource.id,
      });
    }

    await this.resourceRepository.persist(resource);

    return resource;
  }

  private async populateTriggers(triggersIds?: string[]): Promise<void> {
    if (triggersIds && triggersIds.length > 0) {
      const triggers = await this.resourceRepository.searchListBy(triggersIds);

      if (triggers.totalItems === 0) {
        throw new TriggersNotFoundException();
      }

      if (triggers.totalItems !== triggersIds.length) {
        this.logger.error('Some triggers were not found');
      }

      const { triggersToAdd, triggersToRemove } = this.resourceModel.useTriggersAndReturnLegacy(triggers.entities());

      this.triggersToAdd = triggersToAdd;
      this.triggersToRemove = triggersToRemove;
    }
  }

  private async populateActions(actionsIds?: string[]): Promise<void> {
    if (actionsIds && actionsIds.length > 0) {
      const actions = await this.actionFacade.getActionByIds(actionsIds);

      if (actions.totalItems === 0) {
        throw new ActionNotFoundException();
      }

      if (actions.totalItems !== actionsIds.length) {
        this.logger.error('Some actions were not found');
      }

      const { actionsToAdd, actionsToRemove } = this.resourceModel.useActionAndReturnLegacy(actions.entities());

      this.actionsToAdd = actionsToAdd;
      this.actionsToRemove = actionsToRemove;
    }
  }

  private async tryToEmitEvent(updateRelationsWithActionEventBody: UpdateRelationsWithActionEventBody): Promise<void> {
    const event = new UpdateRelationWithActionEvent(updateRelationsWithActionEventBody);
    await this.eventStoreService.emit(event);
  }
}
