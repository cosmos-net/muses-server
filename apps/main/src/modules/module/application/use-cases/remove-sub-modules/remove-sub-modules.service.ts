import { IApplicationServiceCommand } from '@lib-commons/application/application-service-command';
import { Inject, Injectable } from '@nestjs/common';
import { MODULE_REPOSITORY } from '@module-module/application/constants/injection-tokens';
import { IModuleRepository } from '@module-module/domain/contracts/module-repository';
import { RemoveSubModuleCommand } from '@module-module/application/use-cases/remove-sub-modules/remove-sub-modules.command';
import { ModuleNotFoundException } from '@module-common/domain/exceptions/module-not-found.exception';

@Injectable()
export class RemoveSubModuleService implements IApplicationServiceCommand<RemoveSubModuleCommand> {
  constructor(
    @Inject(MODULE_REPOSITORY)
    private moduleRepository: IModuleRepository,
  ) {}

  async process<T extends RemoveSubModuleCommand>(command: T): Promise<void> {
    const { moduleId, subModuleId } = command;

    const module = await this.moduleRepository.searchOneBy(moduleId, {
      withDeleted: true,
    });

    if (!module) {
      throw new ModuleNotFoundException();
    }

    module.removeSubModule(subModuleId);

    await this.moduleRepository.persist(module);
  }
}
