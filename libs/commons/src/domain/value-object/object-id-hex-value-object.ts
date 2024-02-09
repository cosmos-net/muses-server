import { ValueObject } from '@lib-commons/domain/value-object/value-object';
import { ConflictException } from '@nestjs/common';

export abstract class ObjectIdHexValueObject extends ValueObject<string> {
  constructor(value: string) {
    super(value);
    this.ensureObjectId();
  }

  private isValid() {
    const regex = /^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i;
    return regex.test(this.value);
  }

  public ensureObjectId(): void {
    if (!this.isValid()) {
      throw new ConflictException('Invalid ObjectId');
    }
  }
}
