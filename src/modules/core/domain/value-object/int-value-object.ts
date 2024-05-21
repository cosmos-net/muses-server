import { ValueObject } from '@core/domain/value-object/value-object';

export abstract class NumberValueObject extends ValueObject<number> {
  isBiggerThan(other: NumberValueObject): boolean {
    return this.value > other.value;
  }
}
