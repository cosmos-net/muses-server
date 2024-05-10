import { IApplicationServiceQuery } from '@lib-commons/application/application-service-query';
import { Inject, Injectable } from '@nestjs/common';
import { GetModuleQuery } from './get-module.query';
import { Module } from '@module-module/domain/aggregate/module';
import { IModuleRepository } from '@module-module/domain/contracts/module-repository';
import { MODULE_REPOSITORY, PROJECT_MODULE_FACADE } from '@module-module/application/constants/injection-tokens';
import { ModuleNotFoundException } from '@module-common/domain/exceptions/module-not-found.exception';
import { IProjectModuleFacade } from '@module-module/domain/contracts/project-module-facade';

@Injectable()
export class GetModuleService implements IApplicationServiceQuery<GetModuleQuery> {
  constructor(
    @Inject(MODULE_REPOSITORY)
    private moduleRepository: IModuleRepository,
    @Inject(PROJECT_MODULE_FACADE)
    private projectModuleFacade: IProjectModuleFacade,
  ) {}
  async process<T extends GetModuleQuery>(query: T): Promise<Module> {
    const { id, withDisabled, withProject } = query;

    const module = await this.moduleRepository.searchOneBy(id, {
      withDeleted: withDisabled,
    });

    if (module === null) {
      throw new ModuleNotFoundException();
    }

    if (withProject) {
      const project = await this.projectModuleFacade.getProjectById(module.projectId);
      module.useProject(project);
    }

    return module;
  }
}
