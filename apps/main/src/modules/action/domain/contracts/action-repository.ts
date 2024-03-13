import { Action } from '@module-action/domain/aggregate/action';

export interface IActionRepository {
  searchOneBy(id: string, options: { withDeleted: boolean }): Promise<Action | null>;
}
