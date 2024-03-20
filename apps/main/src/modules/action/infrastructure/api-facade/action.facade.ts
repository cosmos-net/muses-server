import { Injectable } from '@nestjs/common';
import { GetActionService } from '@module-action/application/use-cases/get-action/get-action.service';
import { GetActionQuery } from '@module-action/application/use-cases/get-action/get-action.query';
import { Action } from '@module-action/domain/aggregate/action';

@Injectable()
export class ActionFacade {
  constructor(private readonly getActionService: GetActionService) {}

  public getActionById(getActionQuery: GetActionQuery): Promise<Action> {
    return this.getActionService.process(getActionQuery);
  }
}
