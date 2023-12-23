import { IEcosystemSchema } from '@app-main/modules/commons/domain';

export class ListEcosystem {
  private total: number;

  constructor(public domains: IEcosystemSchema[]) {
    this.setTotal(domains.length);
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

  private setTotal(total: number) {
    this.total = total;
  }

  get totalItems(): number {
    return this.total;
  }

  get items(): IEcosystemSchema[] {
    return this.domains;
  }
}
