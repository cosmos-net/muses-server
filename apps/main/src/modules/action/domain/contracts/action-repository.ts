import { Action } from '@module-action/domain/aggregate/action';

export interface IActionRepository {
  searchOneBy(id: string, options: { withDeleted: boolean }): Promise<Action | null>;
  isNameAvailable(name: string): Promise<boolean>;
  persist(model: Action): Promise<Action>;
}
