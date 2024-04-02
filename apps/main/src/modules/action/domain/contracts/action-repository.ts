import { Criteria } from '@lib-commons/domain/criteria/criteria';
import { Action } from '@module-action/domain/aggregate/action';
import { ListAction } from '@module-action/domain/aggregate/list-action';

export interface IActionRepository {
  searchOneBy(id: string, options: { withDeleted: boolean }): Promise<Action | null>;
  isNameAvailable(name: string): Promise<boolean>;
  persist(model: Action): Promise<Action>;
  searchListBy(criteria: Criteria): Promise<ListAction>;
  softDeleteBy(model: Action): Promise<number | undefined>;
}
