import { ActionCatalog } from '@module-action/domain/aggregate/action-catalog';
import { ListActionCatalog } from '@module-action/domain/aggregate/list-action-catalog';

export interface IActionCatalogRepository {
  persist(model: ActionCatalog): Promise<ActionCatalog>;
  oneBy(idOrName: string): Promise<ActionCatalog | null>;
  list(): Promise<ListActionCatalog>;
}
