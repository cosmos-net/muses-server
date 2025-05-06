import { Action } from '@module-action/domain/aggregate/action';
import { IActionSchema } from '@module-action/domain/aggregate/action.schema';

export class ListAction {
  private actions: Action[];
  private total: number;

  constructor(actionsSchema: IActionSchema[], total: number) {
    this.actions = actionsSchema.map((actionSchema) => new Action(actionSchema));
    this.setTotal(total);
  }

  public setTotal(total: number) {
    this.total = total;
  }

  public hydrate(action: any[]): void {
    this.actions = [...action];
    this.setTotal(action.length);
  }

  public add(entity: Action): void {
    this.actions.push(entity);
  }

  public entities(): Action[] {
    return this.actions;
  }

  public get totalItems(): number {
    return this.total;
  }

  public get items(): Action[] {
    return this.actions;
  }

  public set items(items: Action[]) {
    this.actions = items;
  }
}
