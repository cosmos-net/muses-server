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
import { IModuleSchema } from '@module-module/domain/aggregate/module.schema';
import { ISubModuleSchema } from '@module-sub-module/domain/aggregate/sub-module.schema';
import { EventStoreService } from '@lib-commons/application/event-store.service';
import { UpdateRelationsWithModulesEventBody } from '@module-action/domain/events/update-relations-with-modules/update-relations-with-modules-event.body';
import { UpdateRelationsWithModulesEvent } from '@module-action/domain/events/update-relations-with-modules/update-relations-with-modules.event';
import { UpdateRelationsWithSubModulesEventBody } from '@module-action/domain/events/update-relations-with-sub-modules/update-relations-with-sub-modules-event.body';
import { UpdateRelationsWithSubModulesEvent } from '@module-action/domain/events/update-relations-with-sub-modules/update-relations-with-sub-modules.event';

@Injectable()
export class UpdateActionService implements IApplicationServiceCommand<UpdateActionCommand> {
  private modulesLegacy: IModuleSchema[] = [];
  private subModulesLegacy: ISubModuleSchema[] = [];

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
    const { id, name, description, enabled, modules, subModules } = command;

    const action = await this.actionRepository.searchOneBy(id, { withDeleted: true });

    if (!action) {
      throw new Error('Action not found');
    }

    action.redescribe(name, description);
    action.changeStatus(enabled);

    if (modules) {
      const modulesFound = await this.moduleFacade.getModuleByIds(modules);

      if (modulesFound.totalItems === 0) {
        throw new Error('Modules not found');
      }

      this.modulesLegacy = action.useModulesAndReturnModulesLegacy(modulesFound.entities());
    }

    if (subModules) {
      const subModulesFound = await this.subModuleFacade.getSubModuleByIds(subModules);

      if (subModulesFound.totalItems === 0) {
        throw new Error('SubModules not found');
      }

      this.subModulesLegacy = action.useSubModulesAndReturnSubModulesLegacy(subModulesFound.entities());
    }

    await this.tryToEmitEventToUpdateRelationWithModules({
      actionId: action.id,
      legacyModules: this.modulesLegacy.map((module) => module.id),
      newModules: action.modules.map((module) => module.id),
    });

    await this.tryToEmitEventToUpdateRelationWithSubModules({
      actionId: action.id,
      legacySubModules: this.subModulesLegacy.map((subModule) => subModule.id),
      newSubModules: action.subModules.map((subModule) => subModule.id),
    });

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
