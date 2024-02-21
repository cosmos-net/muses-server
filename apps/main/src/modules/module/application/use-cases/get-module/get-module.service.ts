import { IApplicationServiceQuery } from '@lib-commons/application/application-service-query';
import { Inject, Injectable } from '@nestjs/common';
import { GetModuleQuery } from './get-module.query';
import { Module } from '@module-module/domain/aggregate/module';
import { IModuleRepository } from '@module-module/domain/contracts/module-repository';
import { MODULE_REPOSITORY } from '@module-module/application/constants/injection-tokens';

@Injectable()
export class GetModuleService implements IApplicationServiceQuery<GetModuleQuery> {
  constructor(
    @Inject(MODULE_REPOSITORY)
    private moduleRepository: IModuleRepository,
  ) {}
  async process<T extends GetModuleQuery>(query: T): Promise<Module> {
    const { id, withDisabled } = query;

    const module = await this.moduleRepository.searchOneBy(id, {
      withDeleted: withDisabled,
    });

    if (module === null) {
      throw new Error('Module not found');
    }

    return module;
  }
}
