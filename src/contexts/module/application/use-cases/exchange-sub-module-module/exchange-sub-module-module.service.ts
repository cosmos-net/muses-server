import { IApplicationServiceCommand } from '@core/application/application-service-command';
import { Inject, Injectable } from '@nestjs/common';
import { ProjectNotFoundException } from '@module-project/domain/exceptions/project-not-found.exception';
import { ExchangeSubModuleModuleCommand } from '@module-module/application/use-cases/exchange-sub-module-module/exchange-sub-module-module.command';
import { MODULE_REPOSITORY, SUB_MODULE_MODULE_FACADE } from '@module-module/application/constants/injection-tokens';
import { IModuleRepository } from '@module-module/domain/contracts/module-repository';
import { ISubModuleModuleFacade } from '@module-module/domain/contracts/sub-module-facade';

@Injectable()
export class ExchangeSubModuleModuleService implements IApplicationServiceCommand<ExchangeSubModuleModuleCommand> {
  constructor(
    @Inject(SUB_MODULE_MODULE_FACADE)
    private subModuleFacade: ISubModuleModuleFacade,
    @Inject(MODULE_REPOSITORY)
    private moduleRepository: IModuleRepository,
  ) {}

  async process<T extends ExchangeSubModuleModuleCommand>(command: T): Promise<void> {
    const { subModuleId, previousModuleId, newModuleId } = command;

    const subModule = await this.subModuleFacade.getSubModuleBy(subModuleId);

    const previousModule = await this.moduleRepository.searchOneBy(previousModuleId, {
      withDeleted: true,
    });

    if (previousModule === null) {
      throw new ProjectNotFoundException();
    }

    const newModule = await this.moduleRepository.searchOneBy(newModuleId, {
      withDeleted: true,
    });

    if (newModule === null) {
      throw new ProjectNotFoundException();
    }

    previousModule.removeSubModule(subModule.id);
    newModule.addSubModule(subModule);

    await this.moduleRepository.persist(previousModule);
    await this.moduleRepository.persist(newModule);
  }
}
