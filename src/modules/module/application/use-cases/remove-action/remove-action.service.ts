import { IApplicationServiceCommand } from '@core/application/application-service-command';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { RemoveActionCommand } from '@module-module/application/use-cases/remove-action/remove-action.command';
import { IActionFacade } from '@module-module/domain/contracts/action-facade';
import { IModuleRepository } from '@module-module/domain/contracts/module-repository';
import { ACTION_FACADE, MODULE_REPOSITORY } from '@module-module/application/constants/injection-tokens';
import { ModuleNotFoundException } from '@module-common/domain/exceptions/module-not-found.exception';

@Injectable()
export class RemoveActionService implements IApplicationServiceCommand<RemoveActionCommand> {
  private readonly logger = new Logger(RemoveActionService.name);

  constructor(
    @Inject(ACTION_FACADE)
    private actionFacade: IActionFacade,
    @Inject(MODULE_REPOSITORY)
    private moduleRepository: IModuleRepository,
  ) {}

  async process<T extends RemoveActionCommand>(command: T): Promise<void> {
    const { actionId, modules } = command;

    const action = await this.actionFacade.getActionById(actionId);

    if (!action) {
      throw new Error('Action not found');
    }

    const modulesList = await this.moduleRepository.getListByIds(modules);

    if (modulesList.totalItems === 0) {
      throw new ModuleNotFoundException();
    }

    if (modulesList.totalItems !== modules.length) {
      this.logger.warn('Some modules were not found');
    }

    for await (const module of modulesList.items) {
      module.removeAction(actionId);
      await this.moduleRepository.persist(module);
    }
  }
}
