import { ActionFacade } from '@module-action/infrastructure/api-facade/action.facade';
import { Action } from '@module-action/domain/aggregate/action';
import { IActionFacade } from '@module-module/domain/contracts/action-facade';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ActionFacadeService implements IActionFacade {
  constructor(private readonly actionFacade: ActionFacade) {}

  getActionById(id: string): Promise<Action> {
    return this.actionFacade.getActionById({ id, withDisabled: true });
  }
}
