import { Injectable } from '@nestjs/common';
import { UpdateRelationWithActionEvent } from '@module-resource/domain/events/update-relation-with-action-event/update-relation-with-action.event';
import { AddResourceService } from '@module-action/application/use-cases/add-resource/add-resource.service';
import { RemoveResourceService } from '@module-action/application/use-cases/remove-resource/remove-resource.service';

@Injectable()
export class UpdateRelationsWithResourceEventHandler {
  constructor(
    private readonly addActionService: AddResourceService,
    private readonly removeAction: RemoveResourceService,
  ) {}

  public async handle(payload: UpdateRelationWithActionEvent): Promise<void> {
    const {
      body: { actionsToAddResource, actionsToRemoveResource, resourceId },
    } = payload;

    await this.addActionService.process({
      actionsIds: actionsToAddResource,
      resourceId: resourceId,
    });

    await this.removeAction.process({
      actionsIds: actionsToRemoveResource,
      resourceId: resourceId,
    });
  }
}
