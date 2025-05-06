import { GetSubModuleService } from '@module-sub-module/application/use-cases/get-sub-module/get-sub-module.service';
import { GetSubModuleQuery } from '@module-sub-module/application/use-cases/get-sub-module/get-sub-module.query';
import { SubModule } from '@module-sub-module/domain/aggregate/sub-module';
import { Injectable } from '@nestjs/common';
import { GetSubModulesByIdsQuery } from '@module-sub-module/application/use-cases/get-sub-modules-by-ids/get-modules-by-ids.query';
import { ListSubModule } from '@module-sub-module/domain/aggregate/list-sub-module';
import { GetSubModulesByIdsService } from '@module-sub-module/application/use-cases/get-sub-modules-by-ids/get-modules-by-ids.service';

@Injectable()
export class SubModuleFacade {
  constructor(
    private readonly getSubModuleService: GetSubModuleService,
    private readonly getSubModulesByIdsService: GetSubModulesByIdsService,
  ) {}

  public async retrieveSubModule(retrieveSubModuleQuery: GetSubModuleQuery): Promise<SubModule> {
    return this.getSubModuleService.process(retrieveSubModuleQuery);
  }

  public async getSubModulesByIds(getSubModulesByIdsQuery: GetSubModulesByIdsQuery): Promise<ListSubModule> {
    return this.getSubModulesByIdsService.process(getSubModulesByIdsQuery);
  }
}
