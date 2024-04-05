import { Injectable } from '@nestjs/common';
import { GetActionService } from '@module-action/application/use-cases/get-action/get-action.service';
import { GetActionQuery } from '@module-action/application/use-cases/get-action/get-action.query';
import { Action } from '@module-action/domain/aggregate/action';
import { GetAllActionByIds } from '@module-action/application/use-cases/get-all-action-by-ids/get-all-action-by-ids.service';
import { GetAllActionByIdsQuery } from '@module-action/application/use-cases/get-all-action-by-ids/get-all-action-by-ids.query';
import { ListAction } from '@module-action/domain/aggregate/list-action';

@Injectable()
export class ActionFacade {
  constructor(
    private readonly getActionService: GetActionService,
    private readonly getAllActionByIds: GetAllActionByIds,
  ) {}

  public getActionById(getActionQuery: GetActionQuery): Promise<Action> {
    return this.getActionService.process(getActionQuery);
  }

  public getAllActionsByIds(getAllActionByIdsQuery: GetAllActionByIdsQuery): Promise<ListAction> {
    return this.getAllActionByIds.process(getAllActionByIdsQuery);
  }
}
