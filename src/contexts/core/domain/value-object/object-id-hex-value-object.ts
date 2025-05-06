/* eslint-disable hexagonal-architecture/enforce */
import { ValueObject } from '@core/domain/value-object/value-object';
import { regexHexObjectId } from '@core/infrastructure/helpers/regex';
import { ConflictException } from '@nestjs/common';

export abstract class ObjectIdHexValueObject extends ValueObject<string> {
  constructor(value: string) {
    super(value);
    this.ensureObjectId();
  }

  private isValid() {
    return (
      regexHexObjectId.opt1.test(this.value) ||
      regexHexObjectId.opt2.test(this.value) ||
      regexHexObjectId.opt3.test(this.value)
    );
  }

  public ensureObjectId(): void {
    if (!this.isValid()) {
      throw new ConflictException('Invalid ObjectId');
    }
  }
}
