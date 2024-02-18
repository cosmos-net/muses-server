import { IApplicationServiceCommand } from '@lib-commons/application/application-service-command';
import { Inject, Injectable } from '@nestjs/common';
import { CreateModuleCommand } from '@module-module/application/use-cases/create-module/create-module.command';
import { IProjectModuleFacade } from '@module-module/domain/contracts/project-module-facade';
import { IModuleRepository } from '@module-module/domain/contracts/module-repository';
import { Module } from '@module-module/domain/aggregate/module';
import { MODULE_REPOSITORY, PROJECT_MODULE_FACADE } from '@module-module/application/constants/injection-tokens';
import { ModuleNameAlreadyUsedException } from '@module-module/domain/exceptions/module-name-already-used.exception';

@Injectable()
export class CreateModuleService implements IApplicationServiceCommand<CreateModuleCommand> {
  constructor(
    @Inject(PROJECT_MODULE_FACADE)
    private projectModuleFacade: IProjectModuleFacade,
    @Inject(MODULE_REPOSITORY)
    private moduleRepository: IModuleRepository,
  ) {}

  async process<T extends CreateModuleCommand>(command: T): Promise<Module> {
    const { name, description, project, enabled } = command;

    const isNameAvailable = await this.moduleRepository.isNameAvailable(name);

    if (!isNameAvailable) {
      throw new ModuleNameAlreadyUsedException();
    }

    const module = new Module();

    module.describe(name, description);

    if (!enabled) {
      module.enable();
    }

    if (project) {
      const projectModel = await this.projectModuleFacade.getProjectById(project);
      module.useProject({
        id: projectModel.id,
        name: projectModel.name,
        description: projectModel.description,
        isEnabled: projectModel.isEnabled,
        createdAt: projectModel.createdAt,
        updatedAt: projectModel.updatedAt,
        deletedAt: projectModel.deletedAt,
      });
    }

    await this.moduleRepository.persist(module);
    return module;
  }
}
