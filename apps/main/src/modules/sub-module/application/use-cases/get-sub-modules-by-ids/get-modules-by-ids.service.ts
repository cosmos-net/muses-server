import { IApplicationServiceQuery } from '@lib-commons/application/application-service-query';
import { Inject, Injectable } from '@nestjs/common';
import { GetSubModulesByIdsQuery } from '@app-main/modules/sub-module/application/use-cases/get-sub-modules-by-ids/get-modules-by-ids.query';
import { ISubModuleRepository } from '@module-sub-module/domain/contracts/sub-module-repository';
import { SUB_MODULE_REPOSITORY } from '@module-sub-module/application/constants/injection-token';
import { ListSubModule } from '@module-sub-module/domain/aggregate/list-sub-module';

@Injectable()
export class GetSubModulesByIdsService implements IApplicationServiceQuery<GetSubModulesByIdsQuery> {
  constructor(
    @Inject(SUB_MODULE_REPOSITORY)
    private moduleRepository: ISubModuleRepository,
  ) {}

  async process<T extends GetSubModulesByIdsQuery>(query: T): Promise<ListSubModule> {
    const { ids } = query;

    const modules = await this.moduleRepository.getListByIds(ids);

    return modules;
  }
}
