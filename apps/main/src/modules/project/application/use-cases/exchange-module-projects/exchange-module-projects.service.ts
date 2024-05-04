import { IApplicationServiceCommand } from '@lib-commons/application/application-service-command';
import { Inject, Injectable } from '@nestjs/common';
import { IProjectRepository } from '@module-project/domain/contracts/project-repository';
import { MODULE_MODULE_FACADE, PROJECT_REPOSITORY } from '@module-project/application/constants/injection-token';
import { ExchangeModuleProjectsCommand } from '@module-project/application/use-cases/exchange-module-projects/exchange-module-projects.command';
import { IModuleModuleFacadeService } from '@module-project/domain/contracts/module-module-facade';
import { ProjectNotFoundException } from '@module-project/domain/exceptions/project-not-found.exception';

@Injectable()
export class ExchangeModuleProjectsService implements IApplicationServiceCommand<ExchangeModuleProjectsCommand> {
  constructor(
    @Inject(MODULE_MODULE_FACADE)
    private moduleModuleFacadeService: IModuleModuleFacadeService,
    @Inject(PROJECT_REPOSITORY)
    private projectRepository: IProjectRepository,
  ) {}

  async process<T extends ExchangeModuleProjectsCommand>(command: T): Promise<void> {
    const { moduleId, previousProjectId, newProjectId } = command;

    const module = await this.moduleModuleFacadeService.getModuleById(moduleId);

    const previousProject = await this.projectRepository.searchOneBy(previousProjectId, true);

    if (previousProject === null) {
      throw new ProjectNotFoundException();
    }

    const newProject = await this.projectRepository.searchOneBy(newProjectId, true);

    if (newProject === null) {
      throw new ProjectNotFoundException();
    }

    previousProject.removeModule(module);

    newProject.addModule(module);

    await this.projectRepository.persist(previousProject);

    await this.projectRepository.persist(newProject);
  }
}
