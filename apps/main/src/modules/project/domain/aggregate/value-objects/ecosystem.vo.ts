import { IEcosystemSchema } from '@app-main/modules/commons/domain';

export default class Ecosystem {
  constructor(public readonly value: IEcosystemSchema) {}

  getValue(): IEcosystemSchema {
    return this.value;
  }
}
