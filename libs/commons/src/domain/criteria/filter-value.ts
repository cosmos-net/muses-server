import { StringValueObject } from '@lib-commons/domain/value-object/string-value-object';

export class FilterValue extends StringValueObject {
  constructor(value: string) {
    super(value);
  }
}
