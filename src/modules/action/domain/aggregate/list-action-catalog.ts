import { ActionCatalog, IActionCatalogSchema } from '@module-action/domain/aggregate/action-catalog';

export class ListActionCatalog {
  private actionCatalog: ActionCatalog[];
  private total: number;

  constructor(actionCatalogSchema: IActionCatalogSchema[], total: number) {
    this.actionCatalog = actionCatalogSchema.map((actionCatalogSchema) => new ActionCatalog(actionCatalogSchema));
    this.setTotal(total);
  }

  public setTotal(total: number) {
    this.total = total;
  }

  public hydrate(actionCatalog: ActionCatalog[]) {
    this.actionCatalog = [...actionCatalog];
    this.setTotal(actionCatalog.length);
  }

  public add(entity: ActionCatalog): void {
    this.actionCatalog.push(entity);
  }

  public entities(): ActionCatalog[] {
    return this.actionCatalog;
  }

  public get totalItems(): number {
    return this.total;
  }

  public get items(): ActionCatalog[] {
    return this.actionCatalog;
  }

  public set items(items: ActionCatalog[]) {
    this.actionCatalog = items;
  }
}
