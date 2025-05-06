import { IActionRepository } from '@module-action/domain/contracts/action-repository';
import { Inject, Injectable } from '@nestjs/common';
import { ACTION_REPOSITORY } from '@module-action/application/constants/injection-token';
import { IApplicationServiceQuery } from '@core/application/application-service-query';
import { GetAllActionByIdsQuery } from '@module-action/application/use-cases/action/get-all-action-by-ids/get-all-action-by-ids.query';
import { ListAction } from '@module-action/domain/aggregate/list-action';

@Injectable()
export class GetAllActionByIds implements IApplicationServiceQuery<GetAllActionByIdsQuery> {
  constructor(
    @Inject(ACTION_REPOSITORY)
    private actionRepository: IActionRepository,
  ) {}

  async process<T extends GetAllActionByIdsQuery>(query: T): Promise<ListAction> {
    const { ids, withDisabled } = query;

    const listAction = await this.actionRepository.searchListByIds(ids, {
      withDeleted: withDisabled,
    });

    return listAction;
  }
}
