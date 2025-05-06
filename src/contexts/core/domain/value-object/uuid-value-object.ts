import { v4 as uuid } from 'uuid';
import { ValueObject } from '@core/domain/value-object/value-object';
import { ConflictException } from '@nestjs/common';

export class UUID extends ValueObject<string> {
  constructor(value: string) {
    super(value);
    this.ensureIsValidUuid(value);
  }

  static random(): UUID {
    return new UUID(uuid());
  }

  private ensureIsValidUuid(id: string): void {
    if (id === null || id === undefined) {
      throw new ConflictException('Value must be defined');
    }

    const regex = new RegExp('^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$', 'i');

    if (!regex.test(id)) {
      throw new ConflictException(`<${this.constructor.name}> does not allow the value <${id}>`);
    }
  }
}
