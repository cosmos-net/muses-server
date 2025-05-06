import { ListAction } from '@module-action/domain/aggregate/list-action';

export interface IActionFacade {
  getActionByIds(id: string[]): Promise<ListAction>;
}
