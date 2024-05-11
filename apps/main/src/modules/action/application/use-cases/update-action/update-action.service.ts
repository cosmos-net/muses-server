import { IApplicationServiceCommand } from '@lib-commons/application/application-service-command';
import { Inject, Injectable } from '@nestjs/common';
import { UpdateActionCommand } from '@module-action/application/use-cases/update-action/update-action.command';
import {
  ACTION_REPOSITORY,
  MODULE_FACADE,
  SUB_MODULE_FACADE,
} from '@module-action/application/constants/injection-token';
import { IActionRepository } from '@module-action/domain/contracts/action-repository';
import { IModuleFacade } from '@module-action/domain/contracts/module-facade';
import { ISubModuleFacade } from '@module-action/domain/contracts/sub-module-facade';
import { Action } from '@module-action/domain/aggregate/action';
import { EventStoreService } from '@lib-commons/application/event-store.service';
import { UpdateRelationsWithModulesEventBody } from '@module-action/domain/events/update-relations-with-modules/update-relations-with-modules-event.body';
import { UpdateRelationsWithModulesEvent } from '@module-action/domain/events/update-relations-with-modules/update-relations-with-modules.event';
import { UpdateRelationsWithSubModulesEventBody } from '@module-action/domain/events/update-relations-with-sub-modules/update-relations-with-sub-modules-event.body';
import { UpdateRelationsWithSubModulesEvent } from '@module-action/domain/events/update-relations-with-sub-modules/update-relations-with-sub-modules.event';
import { SubModuleNotFoundException } from '@module-common/domain/exceptions/sub-module-not-found.exception';
import { ModuleNotFoundException } from '@module-common/domain/exceptions/module-not-found.exception';
import { ActionNotFoundException } from '@module-action/domain/exceptions/action-not-found.exception';

@Injectable()
export class UpdateActionService implements IApplicationServiceCommand<UpdateActionCommand> {
  constructor(
    @Inject(ACTION_REPOSITORY)
    private actionRepository: IActionRepository,
    @Inject(MODULE_FACADE)
    private moduleFacade: IModuleFacade,
    @Inject(SUB_MODULE_FACADE)
    private subModuleFacade: ISubModuleFacade,
    private readonly eventStoreService: EventStoreService,
  ) {}

  async process<T extends UpdateActionCommand>(command: T): Promise<Action> {
    const { id, name, description, isEnabled, modules, subModules } = command;

    const action = await this.actionRepository.searchOneBy(id, { withDeleted: true });

    if (!action) {
      throw new ActionNotFoundException();
    }

    action.redescribe(name, description);

    if (isEnabled !== undefined) {
      isEnabled ? action.enable() : action.disable();
    }

    if (modules) {
      if (modules.length === 0) {
        action.removeModules();
      } else if (modules.length > 0) {
        const modulesFound = await this.moduleFacade.getModuleByIds(modules);

        if (modulesFound.totalItems === 0) {
          throw new ModuleNotFoundException();
        }

        const modulesLegacy = action.useModulesAndReturnModulesLegacy(modulesFound.entities());

        await this.tryToEmitEventToUpdateRelationWithModules({
          actionId: action.id,
          legacyModules: modulesLegacy,
          newModules: action.modulesIds,
        });
      }
    }

    if (subModules) {
      if (subModules.length === 0) {
        action.removeSubModules();
      } else if (subModules.length > 0) {
        const subModulesFound = await this.subModuleFacade.getSubModuleByIds(subModules);

        if (subModulesFound.totalItems === 0) {
          throw new SubModuleNotFoundException();
        }

        const subModulesLegacy = action.useSubModulesAndReturnSubModulesLegacy(subModulesFound.entities());

        await this.tryToEmitEventToUpdateRelationWithSubModules({
          actionId: action.id,
          legacySubModules: subModulesLegacy,
          newSubModules: action.subModulesIds,
        });
      }
    }

    return this.actionRepository.persist(action);
  }

  private async tryToEmitEventToUpdateRelationWithModules(
    updateRelationsWithModulesEventBody: UpdateRelationsWithModulesEventBody,
  ): Promise<void> {
    const event = new UpdateRelationsWithModulesEvent(updateRelationsWithModulesEventBody);
    await this.eventStoreService.emit(event);
  }

  private async tryToEmitEventToUpdateRelationWithSubModules(
    updateRelationsWithSubModulesEventBody: UpdateRelationsWithSubModulesEventBody,
  ): Promise<void> {
    const event = new UpdateRelationsWithSubModulesEvent(updateRelationsWithSubModulesEventBody);
    await this.eventStoreService.emit(event);
  }
}
