import { IEcosystemSchema } from '@app-main/modules/ecosystem/domain/ecosystem.schema';

export class ListEcosystem {
  private total: number;

  constructor(public domains: IEcosystemSchema[], total: number) {
    this.setTotal(total);
  }

  private setTotal(total: number) {
    this.total = total;
  }

  public hydrate(domains: IEcosystemSchema[]): void {
    this.domains = [...domains];
    this.setTotal(domains.length);
  }

  public add(entity: IEcosystemSchema): void {
    this.domains.push(entity);
  }

  public entities(): IEcosystemSchema[] {
    return this.domains;
  }

  public get totalItems(): number {
    return this.total;
  }

  public get items(): IEcosystemSchema[] {
    return this.domains;
  }
}
