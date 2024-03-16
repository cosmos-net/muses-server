import { IApplicationServiceQuery } from '@lib-commons/application/application-service-query';
import { Inject, Injectable } from '@nestjs/common';
import { GetModulesByIdsQuery } from '@module-module/application/use-cases/get-modules-by-ids/get-modules-by-ids.query';
import { IModuleRepository } from '@module-module/domain/contracts/module-repository';
import { MODULE_REPOSITORY } from '@module-module/application/constants/injection-tokens';
import { ListModule } from '@module-module/domain/list-module';

@Injectable()
export class GetModulesByIdsService implements IApplicationServiceQuery<GetModulesByIdsQuery> {
  constructor(
    @Inject(MODULE_REPOSITORY)
    private moduleRepository: IModuleRepository,
  ) {}

  async process<T extends GetModulesByIdsQuery>(query: T): Promise<ListModule> {
    const { ids } = query;

    const modules = await this.moduleRepository.getListByIds(ids);

    return modules;
  }
}
