import { IEcosystemSchema } from '@app-main/modules/ecosystem/domain/aggregate/ecosystem.schema';
export default class Ecosystem {
  constructor(public readonly value: IEcosystemSchema) {}

  getValue(): IEcosystemSchema {
    return this.value;
  }
}
