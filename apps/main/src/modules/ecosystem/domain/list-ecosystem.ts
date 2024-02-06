import { IEcosystemSchema } from '@app-main/modules/ecosystem/domain/ecosystem.schema';

export class ListEcosystem {
  private total: number;

  constructor(public ecosystem: IEcosystemSchema[], total: number) {
    this.setTotal(total);
  }

  private setTotal(total: number) {
    this.total = total;
  }

  public hydrate(ecosystem: IEcosystemSchema[]): void {
    this.ecosystem = [...ecosystem];
    this.setTotal(ecosystem.length);
  }

  public add(entity: IEcosystemSchema): void {
    this.ecosystem.push(entity);
  }

  public entities(): IEcosystemSchema[] {
    return this.ecosystem;
  }

  public get totalItems(): number {
    return this.total;
  }

  public get items(): IEcosystemSchema[] {
    return this.ecosystem;
  }
}
