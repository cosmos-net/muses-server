import { Action } from '@module-action/domain/aggregate/action';

export interface IActionFacade {
  getActionById(id: string): Promise<Action>;
}
