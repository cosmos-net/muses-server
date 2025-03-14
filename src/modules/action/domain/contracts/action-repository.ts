import { Criteria } from '@core/domain/criteria/criteria';
import { Action } from '@module-action/domain/aggregate/action';
import { ListAction } from '@module-action/domain/aggregate/list-action';

export interface IActionRepository {
  searchOneBy(id: string, options: { withDeleted: boolean }): Promise<Action | null>;
  searchListByIds(ids: string[], options: { withDeleted: boolean }): Promise<ListAction>;
  isNameAvailable(name: string): Promise<boolean>;
  persist(model: Action): Promise<Action>;
  searchListBy(criteria: Criteria): Promise<ListAction>;
}
