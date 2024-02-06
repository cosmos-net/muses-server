import { StringValueObject } from '@lib-commons/domain/value-object/string-value-object';

export class OrderBy extends StringValueObject {
  constructor(value: string) {
    super(value);
  }
}
