import { EnumValueObject } from '@lib-commons/domain/value-object/enum-value-object';

export enum EnumMethodValue {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
  PATCH = 'PATCH',
}

export default class Method extends EnumValueObject<EnumMethodValue> {
  constructor(value: EnumMethodValue) {
    super(value, [
      EnumMethodValue.GET,
      EnumMethodValue.POST,
      EnumMethodValue.PUT,
      EnumMethodValue.DELETE,
      EnumMethodValue.PATCH,
    ]);
  }

  protected throwErrorForInvalidValue(value: EnumMethodValue): void {
    if (!Object.values(EnumMethodValue).includes(value)) {
      throw new Error(`Invalid method value: ${value}`);
    }
  }
}
