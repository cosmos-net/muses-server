import { IApplicationServiceCommand } from '@core/application/application-service-command';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ExchangeActionSubModulesCommand } from '@module-sub-module/application/use-cases/exchange-action-sub-modules/exchange-action-sub-modules.command';
import { ACTION_FACADE, SUB_MODULE_REPOSITORY } from '@module-sub-module/application/constants/injection-token';
import { IActionFacade } from '@module-sub-module/domain/contracts/action-facade';
import { ISubModuleRepository } from '@module-sub-module/domain/contracts/sub-module-repository';

@Injectable()
export class ExchangeActionSubModulesService implements IApplicationServiceCommand<ExchangeActionSubModulesCommand> {
  private readonly logger = new Logger(ExchangeActionSubModulesService.name);

  constructor(
    @Inject(SUB_MODULE_REPOSITORY)
    private subModuleRepository: ISubModuleRepository,
    @Inject(ACTION_FACADE)
    private actionFacade: IActionFacade,
  ) {}

  public async process(command: ExchangeActionSubModulesCommand): Promise<void> {
    const { actionId, legacySubModules, newSubModules } = command;

    const action = await this.actionFacade.getActionById(actionId);

    if (!action.isEnabled) {
      throw new Error('Action is disabled');
    }

    await this.updateLegacySubModules(action.id, legacySubModules);

    await this.updateNewSubModules(action.id, newSubModules);
  }

  private async updateLegacySubModules(actionId: string, legacySubModules: string[]): Promise<void> {
    for await (const subModuleId of legacySubModules) {
      const subModule = await this.subModuleRepository.searchOneBy(subModuleId, { withDeleted: true });

      if (!subModule) {
        this.logger.error(`Sub module not found with id: ${subModuleId}`);
        continue;
      }

      subModule.removeAction(actionId);

      await this.subModuleRepository.persist(subModule);
    }
  }

  private async updateNewSubModules(actionId: string, newSubModules: string[]): Promise<void> {
    for await (const subModuleId of newSubModules) {
      const subModule = await this.subModuleRepository.searchOneBy(subModuleId, { withDeleted: true });

      if (!subModule) {
        this.logger.error(`Sub module not found with id: ${subModuleId}`);
        continue;
      }

      subModule.addAction(actionId);

      await this.subModuleRepository.persist(subModule);
    }
  }
}
