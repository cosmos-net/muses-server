import { IApplicationServiceCommand } from '@core/application/application-service-command';
import { Inject, Injectable } from '@nestjs/common';
import { IProjectRepository } from '@module-project/domain/contracts/project-repository';
import { MODULE_MODULE_FACADE, PROJECT_REPOSITORY } from '@module-project/application/constants/injection-token';
import { AddModuleCommand } from '@module-project/application/use-cases/add-module/add-module.command';
import { IModuleModuleFacadeService } from '@module-project/domain/contracts/module-module-facade';
import { ProjectNotFoundException } from '@module-project/domain/exceptions/project-not-found.exception';

@Injectable()
export class AddModuleService implements IApplicationServiceCommand<AddModuleCommand> {
  constructor(
    @Inject(MODULE_MODULE_FACADE)
    private moduleModuleFacadeService: IModuleModuleFacadeService,
    @Inject(PROJECT_REPOSITORY)
    private projectRepository: IProjectRepository,
  ) {}

  async process<T extends AddModuleCommand>(command: T): Promise<void> {
    const { moduleId, projectId } = command;

    const module = await this.moduleModuleFacadeService.getModuleById(moduleId);

    const project = await this.projectRepository.searchOneBy(projectId, true);

    if (project === null) {
      throw new ProjectNotFoundException();
    }

    project.addModule(module);

    await this.projectRepository.persist(project);
  }
}
