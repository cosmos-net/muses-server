import { Inject, Injectable } from '@nestjs/common';
import { IApplicationServiceCommand } from '@lib-commons/application/application-service-command';
import { ACTION_REPOSITORY, RESOURCE_FACADE } from '@module-action/application/constants/injection-token';
import { IActionRepository } from '@app-main/modules/action/domain/contracts/action-repository';
import { RemoveResourceCommand } from '@app-main/modules/action/application/use-cases/remove-resource/remove-resource.command';
import { IResourceFacade } from '@module-action/domain/contracts/resource-facade';

@Injectable()
export class RemoveResourceService implements IApplicationServiceCommand<RemoveResourceCommand> {
  constructor(
    @Inject(ACTION_REPOSITORY)
    private actionRepository: IActionRepository,
    @Inject(RESOURCE_FACADE)
    private resourceFacade: IResourceFacade,
  ) {}

  async process<T extends RemoveResourceCommand>(command: T): Promise<void> {
    const { actionsIds, resourceId } = command;

    if (actionsIds.length > 0) {
      const resource = await this.resourceFacade.getResourceById(resourceId);

      const actionsList = await this.actionRepository.searchListByIds(actionsIds, {
        withDeleted: true,
      });

      for await (const action of actionsList.entities()) {
        action.removeResource(resource.id);
        await this.actionRepository.persist(action);
      }
    }
  }
}
