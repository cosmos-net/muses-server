import { Injectable, Inject } from '@nestjs/common';
import { IModuleRepository } from '@module-module/domain/contracts/module-repository';
import { IApplicationServiceCommand } from '@lib-commons/application/application-service-command';
import { AddSubModuleCommand } from './add-submodule.command';
import { ISubModuleModuleFacade } from '@module-module/domain/contracts/sub-module-facade';
import { MODULE_REPOSITORY, SUB_MODULE_MODULE_FACADE } from '@module-module/application/constants/injection-tokens';
import { SubModuleDisabledException } from '@module-sub-module/domain/exceptions/submodule-disabled.exception';
import { ModuleDisabledException } from '@module-module/domain/exceptions/module-disabled.exception';
import { ModuleNotFoundException } from '@module-common/domain/exceptions/module-not-found.exception';

@Injectable()
export class AddSubModuleService implements IApplicationServiceCommand<AddSubModuleCommand> {
  constructor(
    @Inject(SUB_MODULE_MODULE_FACADE)
    private subModuleFacade: ISubModuleModuleFacade,
    @Inject(MODULE_REPOSITORY)
    private moduleRepository: IModuleRepository,
  ) {}

  async process<T extends AddSubModuleCommand>(command: T): Promise<void> {
    const { subModuleId, moduleId } = command;

    const subModule = await this.subModuleFacade.getSubModuleBy(subModuleId);

    if (!subModule.isEnabled) {
      throw new SubModuleDisabledException();
    }

    const module = await this.moduleRepository.searchOneBy(moduleId, { withDeleted: true });

    if (module === null) {
      throw new ModuleNotFoundException();
    }

    if (!module.isEnabled) {
      throw new ModuleDisabledException();
    }

    module.addSubModule(subModule);

    await this.moduleRepository.persist(module);
  }
}
