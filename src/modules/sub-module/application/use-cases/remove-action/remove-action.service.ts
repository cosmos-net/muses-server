import { IApplicationServiceCommand } from '@core/application/application-service-command';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ACTION_FACADE, SUB_MODULE_REPOSITORY } from '@module-sub-module/application/constants/injection-token';
import { IActionFacade } from '@module-sub-module/domain/contracts/action-facade';
import { ISubModuleRepository } from '@module-sub-module/domain/contracts/sub-module-repository';
import { RemoveActionCommand } from '@module-sub-module/application/use-cases/remove-action/remove-action.command';
import { SubModuleNotFoundException } from '@module-common/domain/exceptions/sub-module-not-found.exception';

@Injectable()
export class RemoveActionService implements IApplicationServiceCommand<RemoveActionCommand> {
  private readonly logger = new Logger(RemoveActionService.name);

  constructor(
    @Inject(SUB_MODULE_REPOSITORY)
    private subModuleRepository: ISubModuleRepository,
    @Inject(ACTION_FACADE)
    private actionFacade: IActionFacade,
  ) {}

  async process<T extends RemoveActionCommand>(command: T): Promise<void> {
    const { actionId, subModules } = command;

    const action = await this.actionFacade.getActionById(actionId);

    if (!action) {
      throw new Error('Action not found');
    }

    const subModulesList = await this.subModuleRepository.getListByIds(subModules);

    if (subModulesList.totalItems === 0) {
      throw new SubModuleNotFoundException();
    }

    if (subModulesList.totalItems !== subModules.length) {
      this.logger.warn('Some modules were not found');
    }

    for await (const subModule of subModulesList.items) {
      subModule.removeAction(actionId);
      await this.subModuleRepository.persist(subModule);
    }
  }
}
