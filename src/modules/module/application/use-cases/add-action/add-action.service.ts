import { Injectable, Inject, Logger } from '@nestjs/common';
import { IModuleRepository } from '@module-module/domain/contracts/module-repository';
import { IApplicationServiceCommand } from '@core/application/application-service-command';
import { AddActionCommand } from './add-action.command';
import { ACTION_FACADE, MODULE_REPOSITORY } from '@module-module/application/constants/injection-tokens';
import { IActionFacade } from '@module-module/domain/contracts/action-facade';
import { ModuleNotFoundException } from '@module-common/domain/exceptions/module-not-found.exception';

@Injectable()
export class AddActionService implements IApplicationServiceCommand<AddActionCommand> {
  constructor(
    @Inject(ACTION_FACADE)
    private actionFacade: IActionFacade,
    @Inject(MODULE_REPOSITORY)
    private moduleRepository: IModuleRepository,
  ) {}
  private readonly logger = new Logger(AddActionService.name);

  async process<T extends AddActionCommand>(command: T): Promise<void> {
    const { actionId, modules } = command;

    const action = await this.actionFacade.getActionById(actionId);
    const listModules = await this.moduleRepository.getListByIds(modules);

    if (listModules.totalItems === 0) {
      throw new ModuleNotFoundException();
    }

    if (listModules.totalItems !== modules.length) {
      this.logger.warn('Some modules were not found');
    }

    for await (const module of listModules.entities()) {
      module.addAction(action.id);

      await this.moduleRepository.persist(module);
    }
  }
}
