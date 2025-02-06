import { IApplicationServiceCommand } from '@core/application/application-service-command';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { UpdateActionCommand } from '@module-action/application/use-cases/action/update-action/update-action.command';
import {
  ACTION_CATALOG_REPOSITORY,
  ACTION_REPOSITORY,
  MODULE_FACADE,
  SUB_MODULE_FACADE,
} from '@module-action/application/constants/injection-token';
import { IActionRepository } from '@module-action/domain/contracts/action-repository';
import { IModuleFacade } from '@module-action/domain/contracts/module-facade';
import { ISubModuleFacade } from '@module-action/domain/contracts/sub-module-facade';
import { Action } from '@module-action/domain/aggregate/action';
import { EventStoreService } from '@core/application/event-store.service';
import { UpdateRelationsWithModulesEventBody } from '@module-action/domain/events/update-relations-with-modules/update-relations-with-modules-event.body';
import { UpdateRelationsWithModulesEvent } from '@module-action/domain/events/update-relations-with-modules/update-relations-with-modules.event';
import { UpdateRelationsWithSubModulesEventBody } from '@module-action/domain/events/update-relations-with-sub-modules/update-relations-with-sub-modules-event.body';
import { UpdateRelationsWithSubModulesEvent } from '@module-action/domain/events/update-relations-with-sub-modules/update-relations-with-sub-modules.event';
import { SubModuleNotFoundException } from '@module-common/domain/exceptions/sub-module-not-found.exception';
import { ModuleNotFoundException } from '@module-common/domain/exceptions/module-not-found.exception';
import { ActionNotFoundException } from '@module-action/domain/exceptions/action-not-found.exception';
import { IActionCatalogRepository } from '@module-action/domain/contracts/action-catalog-repository';

@Injectable()
export class UpdateActionService implements IApplicationServiceCommand<UpdateActionCommand> {
  constructor(
    @Inject(ACTION_REPOSITORY)
    private readonly actionRepository: IActionRepository,
    @Inject(MODULE_FACADE)
    private readonly moduleFacade: IModuleFacade,
    @Inject(SUB_MODULE_FACADE)
    private readonly subModuleFacade: ISubModuleFacade,
    private readonly eventStoreService: EventStoreService,
    @Inject(ACTION_CATALOG_REPOSITORY)
    private readonly actionCatalogRepository: IActionCatalogRepository,
  ) {}

  async process<T extends UpdateActionCommand>(command: T): Promise<Action> {
    const { id, name, description, isEnabled, module, submodule, actionCatalog } = command;

    const action = await this.actionRepository.searchOneBy(id, { withDeleted: true });

    if (!action) {
      throw new ActionNotFoundException();
    }

    action.redescribe(name, description);

    if (isEnabled !== undefined) {
      isEnabled ? action.enable() : action.disable();
    }

   if (module) {
        const modulesFound = await this.moduleFacade.getModuleByIds([module]);

        if (modulesFound.totalItems === 0) {
          throw new ModuleNotFoundException();
        }

        const currentModule = action.moduleId;
        const newModule = modulesFound.entities()[0].id;

        action.replaceModule(modulesFound.entities()[0]);

        await this.tryToEmitEventToUpdateRelationWithModules({
          actionId: action.id,
          legacyModules: [currentModule],
          newModules: [newModule],
        });
      }

      if (submodule) {
        const subModulesFound = await this.subModuleFacade.getSubModuleByIds([submodule]);

        if (subModulesFound.totalItems === 0) {
          throw new SubModuleNotFoundException();
        }

        const currentSubModule = action.submoduleId;
        const newSubModule = subModulesFound.entities()[0].id;

        action.replaceSubmodule(subModulesFound.entities()[0]);

        await this.tryToEmitEventToUpdateRelationWithSubModules({
          actionId: action.id,
          legacySubModules: currentSubModule ? [currentSubModule] : [],
          newSubModules: [newSubModule],
        });
      }

    if (actionCatalog) {
      const actionCatalogFound = await this.actionCatalogRepository.oneBy(actionCatalog);

      if (!actionCatalogFound) {
        throw new NotFoundException(`Action catalog ${actionCatalog} not found`);
      }

      action.categorize(actionCatalogFound);
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
