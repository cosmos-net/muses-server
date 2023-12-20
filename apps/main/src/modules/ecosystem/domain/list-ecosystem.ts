import { IEcosystemSchema } from '@app-main/modules/commons/domain';

export class ListEcosystem {
  constructor(public domains: IEcosystemSchema[], public readonly total: number) {}

  public hydrate(domains: IEcosystemSchema[]): void {
    this.domains = [...domains];
  }

  public add(entity: IEcosystemSchema): void {
    this.domains.push(entity);
  }

  public entities(): IEcosystemSchema[] {
    return this.domains;
  }
}