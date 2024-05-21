import { StringValueObject } from '@core/domain/value-object/string-value-object';

export class FilterField extends StringValueObject {
  constructor(value: string) {
    super(value);
  }
}
