import { IApplicationServiceCommand } from '@lib-commons/application/application-service-command';
import { Inject, Injectable } from '@nestjs/common';
import { UpdateModuleCommand } from '@module-module/application/use-cases/update-module/update-module.command';
import { MODULE_REPOSITORY, PROJECT_MODULE_FACADE } from '@module-module/application/constants/injection-tokens';
import { IProjectModuleFacade } from '@module-module/domain/contracts/project-module-facade';
import { IModuleRepository } from '@module-module/domain/contracts/module-repository';
import { Module } from '@module-module/domain/aggregate/module';
import { ModuleNotFoundException } from '@module-module/domain/exceptions/module-not-found.exception';
import { ModuleAlreadyRelatedWithProject } from '@module-module/domain/exceptions/module-already-related-with-project.exception';

@Injectable()
export class UpdateModuleService implements IApplicationServiceCommand<UpdateModuleCommand> {
  constructor(
    @Inject(PROJECT_MODULE_FACADE)
    private projectModulFacade: IProjectModuleFacade,
    @Inject(MODULE_REPOSITORY)
    private moduleRepository: IModuleRepository,
  ) {}

  async process<T extends UpdateModuleCommand>(command: T): Promise<Module> {
    const { id, name, description, enabled, project } = command;

    const module = await this.moduleRepository.searchOneBy(id, { withDeleted: true });

    if (!module) {
      throw new ModuleNotFoundException();
    }

    if (project) {
      if (module.projectId === project) {
        throw new ModuleAlreadyRelatedWithProject();
      }

      const projectModel = await this.projectModulFacade.getProjectById(project);
      module.useProject(projectModel);
    }

    if (name || description) {
      module.redescribe(name, description);
    }

    if (enabled !== undefined) {
      module.changeStatus(enabled);
    }

    await this.moduleRepository.persist(module);

    return module;
  }
}
