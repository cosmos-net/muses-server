import { IApplicationServiceCommand } from '@core/application/application-service-command';
import { Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { DisableActionCommand } from '@module-action/application/use-cases/disable-action/disable-action.command';
import { ACTION_REPOSITORY } from '@module-action/application/constants/injection-token';
import { IActionRepository } from '@module-action/domain/contracts/action-repository';
import { ActionNotFoundException } from '@module-action/domain/exceptions/action-not-found.exception';
import { Action } from '@module-action/domain/aggregate/action';
import { RemoveActionFromModulesEventBody } from '@module-action/domain/events/remove-action-from-modules/remove-action-from-modules-event.body';
import { RemoveActionFromModulesEvent } from '@module-action/domain/events/remove-action-from-modules/remove-action-from-modules.event';
import { EventStoreService } from '@core/application/event-store.service';
import { RemoveActionFromSubModulesEventBody } from '@module-action/domain/events/remove-action-from-sub-modules/remove-action-from-sub-modules-event.body';
import { RemoveActionFromSubModulesEvent } from '@module-action/domain/events/remove-action-from-sub-modules/remove-action-from-sub-modules.event';

@Injectable()
export class DisableActionService implements IApplicationServiceCommand<DisableActionCommand> {
  constructor(
    @Inject(ACTION_REPOSITORY)
    private actionRepository: IActionRepository,
    private readonly eventStoreService: EventStoreService,
  ) {}

  async process<T extends DisableActionCommand>(command: T): Promise<number | undefined> {
    const { id } = command;

    const action = await this.actionRepository.searchOneBy(id, {
      withDeleted: true,
    });

    if (!action) {
      throw new ActionNotFoundException();
    }

    action.disable();

    await this.actionRepository.persist(action);

    await this.tryToEmitRemoveActionFromModulesEvent(action, {
      actionId: action.id,
      modules: action.modulesIds,
    });

    await this.tryToEmitRemoveActionFromSubModulesEvent(action, {
      actionId: action.id,
      subModules: action.subModulesIds,
    });

    return 1;
  }

  private async tryToEmitRemoveActionFromModulesEvent(
    action: Action,
    removeDisabledActionFromModuleEventBody: RemoveActionFromModulesEventBody,
  ): Promise<any[]> {
    try {
      const event = new RemoveActionFromModulesEvent(removeDisabledActionFromModuleEventBody);
      return await this.eventStoreService.emit(event);
    } catch (err) {
      action.restore();
      await this.actionRepository.persist(action);
      throw new InternalServerErrorException(err);
    }
  }

  private async tryToEmitRemoveActionFromSubModulesEvent(
    action: Action,
    removeDisabledActionFromSubModuleEventBody: RemoveActionFromSubModulesEventBody,
  ): Promise<any[]> {
    try {
      const event = new RemoveActionFromSubModulesEvent(removeDisabledActionFromSubModuleEventBody);
      return await this.eventStoreService.emit(event);
    } catch (err) {
      action.restore();
      await this.actionRepository.persist(action);
      throw new InternalServerErrorException(err);
    }
  }
}
