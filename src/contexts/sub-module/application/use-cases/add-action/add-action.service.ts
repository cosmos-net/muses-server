import { Injectable, Inject, Logger } from '@nestjs/common';
import { IApplicationServiceCommand } from '@core/application/application-service-command';
import { AddActionCommand } from './add-action.command';
import { ISubModuleRepository } from '@module-sub-module/domain/contracts/sub-module-repository';
import { ACTION_FACADE, SUB_MODULE_REPOSITORY } from '@module-sub-module/application/constants/injection-token';
import { IActionFacade } from '@module-sub-module/domain/contracts/action-facade';

@Injectable()
export class AddActionService implements IApplicationServiceCommand<AddActionCommand> {
  constructor(
    @Inject(SUB_MODULE_REPOSITORY)
    private subModuleRepository: ISubModuleRepository,
    @Inject(ACTION_FACADE)
    private actionFacade: IActionFacade,
  ) {}
  private readonly logger = new Logger(AddActionService.name);

  async process<T extends AddActionCommand>(command: T): Promise<void> {
    const { actionId, subModules } = command;
    await this.updateSubModules(actionId, subModules);
  }

  private async updateSubModules(actionId: string, subModules: string[]): Promise<void> {
    for await (const subModuleId of subModules) {
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
