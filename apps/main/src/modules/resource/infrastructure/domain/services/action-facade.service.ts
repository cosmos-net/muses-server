import { ListAction } from '@module-action/domain/aggregate/list-action';
import { ActionFacade } from '@module-action/infrastructure/api-facade/action.facade';
import { IActionFacade } from '@module-resource/domain/contracts/action-facade';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ActionFacadeService implements IActionFacade {
  constructor(private actionFacade: ActionFacade) {}

  async getActionByIds(ids: string[]): Promise<ListAction> {
    return await this.actionFacade.getAllActionsByIds({
      ids: ids,
      withDisabled: false,
    });
  }
}
