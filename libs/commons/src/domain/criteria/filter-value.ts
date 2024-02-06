import { Primitives, ValueObject } from '@lib-commons/domain/value-object/value-object';

export class FilterValue<T extends Primitives> extends ValueObject<T> {
  constructor(value: T) {
    super(value);
  }
}
