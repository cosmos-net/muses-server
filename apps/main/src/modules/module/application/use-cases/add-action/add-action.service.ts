import { Injectable, Inject, Logger } from '@nestjs/common';
import { IModuleRepository } from '@module-module/domain/contracts/module-repository';
import { IApplicationServiceCommand } from '@lib-commons/application/application-service-command';
import { AddActionCommand } from './add-action.command';
import { ISubModuleModuleFacade } from '@module-module/domain/contracts/sub-module-facade';
import { MODULE_REPOSITORY, SUB_MODULE_MODULE_FACADE } from '@module-module/application/constants/injection-tokens';

@Injectable()
export class AddActionService implements IApplicationServiceCommand<AddActionCommand> {
  constructor(
    @Inject(SUB_MODULE_MODULE_FACADE)
    private subModuleFacade: ISubModuleModuleFacade,
    @Inject(MODULE_REPOSITORY)
    private moduleRepository: IModuleRepository,
  ) {}
  private readonly logger = new Logger(AddActionService.name);

  async process<T extends AddActionCommand>(command: T): Promise<void> {
    const { actionId, modules } = command;
    await this.updateModules(actionId, modules);
  }

  private async updateModules(actionId: string, updateModules: string[]): Promise<void> {
    for await (const moduleId of updateModules) {
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
