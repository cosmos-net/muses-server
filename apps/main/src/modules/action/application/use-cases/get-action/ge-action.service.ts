import { IActionRepository } from '@module-action/domain/contracts/action-repository';
import { Inject, Injectable } from '@nestjs/common';
import { ACTION_REPOSITORY } from '../../constants/injection-token';
import { IApplicationServiceQuery } from '@lib-commons/application/application-service-query';
import { GetActionQuery } from '@module-action/application/use-cases/get-action/get-action.query';
import { Action } from '@module-action/domain/aggregate/action';
import { ActionNotFoundException } from '@module-action/domain/exceptions/action-not-found.exception';

@Injectable()
export class GetActionService implements IApplicationServiceQuery<GetActionQuery> {
  constructor(
    @Inject(ACTION_REPOSITORY)
    private actionRepository: IActionRepository,
  ) {}

  async process<T extends GetActionQuery>(query: T): Promise<Action> {
    const { id, withDisabled } = query;

    const action = await this.actionRepository.searchOneBy(id, {
      withDeleted: withDisabled,
    });

    if (action === null) {
      throw new ActionNotFoundException();
    }

    return action;
  }
}
