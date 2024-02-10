import { IEcosystemSchema } from '@module-eco/domain/aggregate/ecosystem.schema';
export default class Ecosystem {
  constructor(id: string);
  constructor(schema: IEcosystemSchema);
  constructor(public readonly value: string | IEcosystemSchema) {}

  get id() {
    return this.value instanceof Object ? this.value.id : this.value;
  }
}
