import { ISubModuleRepository } from '@module-sub-module/domain/contracts/sub-module-repository';
import { Inject, Injectable } from '@nestjs/common';
import { SUB_MODULE_REPOSITORY } from '@module-sub-module/application/constants/injection-token';
import { IApplicationServiceQuery } from '@lib-commons/application/application-service-query';
import { GetSubModuleQuery } from '@module-sub-module/application/use-cases/get-sub-module/get-sub-module.query';
import { SubModule } from '@module-sub-module/domain/aggregate/sub-module';
import { SubModuleNotFoundException } from '@module-sub-module/domain/exceptions/sub-module-not-found.exception';

@Injectable()
export class GetSubModuleService implements IApplicationServiceQuery<GetSubModuleQuery> {
  constructor(
    @Inject(SUB_MODULE_REPOSITORY)
    private subModuleRepository: ISubModuleRepository,
  ) {}

  async process<T extends GetSubModuleQuery>(query: T): Promise<SubModule> {
    const { id, withDisabled } = query;

    const subModule = await this.subModuleRepository.searchOneBy(id, {
      withDeleted: withDisabled,
    });

    if (subModule === null) {
      throw new SubModuleNotFoundException();
    }

    return subModule;
  }
}
