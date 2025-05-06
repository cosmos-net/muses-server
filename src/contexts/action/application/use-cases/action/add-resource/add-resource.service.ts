import { Inject, Injectable } from '@nestjs/common';
import { IApplicationServiceCommand } from '@core/application/application-service-command';
import { AddResourceCommand } from '@module-action/application/use-cases/action/add-resource/add-resource.command';
import { ACTION_REPOSITORY, RESOURCE_FACADE } from '@module-action/application/constants/injection-token';
import { IActionRepository } from '@module-action/domain/contracts/action-repository';
import { IResourceFacade } from '@module-action/domain/contracts/resource-facade';

@Injectable()
export class AddResourceService implements IApplicationServiceCommand<AddResourceCommand> {
  constructor(
    @Inject(ACTION_REPOSITORY)
    private actionRepository: IActionRepository,
    @Inject(RESOURCE_FACADE)
    private resourceFacade: IResourceFacade,
  ) {}

  async process<T extends AddResourceCommand>(command: T): Promise<void> {
    const { actionsIds, resourceId } = command;

    if (actionsIds.length > 0) {
      const resource = await this.resourceFacade.getResourceById(resourceId);

      const actionsList = await this.actionRepository.searchListByIds(actionsIds, {
        withDeleted: true,
      });

      for await (const action of actionsList.entities()) {
        action.addResource(resource.id);
        await this.actionRepository.persist(action);
      }
    }
  }
}
