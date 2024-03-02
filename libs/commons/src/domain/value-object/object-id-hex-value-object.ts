import { ValueObject } from '@lib-commons/domain/value-object/value-object';
import { ConflictException } from '@nestjs/common';

export abstract class ObjectIdHexValueObject extends ValueObject<string> {
  constructor(value: string) {
    super(value);
    this.ensureObjectId();
  }

  private isValid() {
    const regex = new RegExp('^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$', 'i');
    const regex2 = new RegExp('^[0-9a-f]{24}$', 'i');

    return regex.test(this.value) || regex2.test(this.value);
  }

  public ensureObjectId(): void {
    if (!this.isValid()) {
      throw new ConflictException('Invalid ObjectId');
    }
  }
}
