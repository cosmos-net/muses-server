import { ValueObject } from '@lib-commons/domain/value-object/value-object';

export abstract class BooleanValueObject extends ValueObject<boolean> {
  constructor(value: boolean) {
    super(value);
    this.ensureIsBoolean();
  }

  private isValid(): boolean {
    return typeof this.value === 'boolean';
  }

  private ensureIsBoolean(): void {
    if (!this.isValid()) {
      throw new Error('The value must be a boolean');
    }
  }
}
