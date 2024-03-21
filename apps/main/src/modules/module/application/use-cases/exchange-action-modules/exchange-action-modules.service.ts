import { IApplicationServiceCommand } from '@lib-commons/application/application-service-command';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ExchangeActionModulesCommand } from '@module-module/application/use-cases/exchange-action-modules/exchange-action-modules.command';
import { ACTION_FACADE, MODULE_REPOSITORY } from '@module-module/application/constants/injection-tokens';
import { IActionFacade } from '@module-module/domain/contracts/action-facade';
import { IModuleRepository } from '@module-module/domain/contracts/module-repository';

@Injectable()
export class ExchangeActionModulesService implements IApplicationServiceCommand<ExchangeActionModulesCommand> {
  private readonly logger = new Logger(ExchangeActionModulesService.name);

  constructor(
    @Inject(MODULE_REPOSITORY)
    private moduleRepository: IModuleRepository,
    @Inject(ACTION_FACADE)
    private actionFacade: IActionFacade,
  ) {}

  public async process(command: ExchangeActionModulesCommand): Promise<void> {
    const { actionId, legacyModules, newModules } = command;

    const action = await this.actionFacade.getActionById(actionId);

    if (!action.isEnabled) {
      throw new Error('Action is disabled');
    }

    await this.updateLegacyModules(action.id, newModules);

    await this.updateNewModules(action.id, legacyModules);
  }

  private async updateLegacyModules(actionId: string, legacyModules: string[]): Promise<void> {
    for await (const moduleId of legacyModules) {
      const module = await this.moduleRepository.searchOneBy(moduleId, { withDeleted: true });

      if (!module) {
        this.logger.error(`Module not found with id: ${moduleId}`);
        continue;
      }

      module.removeAction(actionId);

      await this.moduleRepository.persist(module);
    }
  }

  private async updateNewModules(actionId: string, newModules: string[]): Promise<void> {
    for await (const moduleId of newModules) {
      const module = await this.moduleRepository.searchOneBy(moduleId, { withDeleted: true });

      if (!module) {
        this.logger.error(`Module not found with id: ${moduleId}`);
        continue;
      }

      module.addAction(actionId);

      await this.moduleRepository.persist(module);
    }
  }
}
