import { ConflictException } from '@nestjs/common';

export type Primitives = string | number | boolean | Date | string[] | number[] | boolean[];

// TODO: Handle this class to define all the common methods for the value objects
export abstract class ValueObject<T extends Primitives> {
  readonly value: T;

  constructor(value: T) {
    this.value = value;
    this.ensureValueIsDefined(value);
  }

  private ensureValueIsDefined(value: T): void {
    if (value === null || value === undefined) {
      throw new ConflictException('Value must be defined');
    }
  }

  public equals(other: ValueObject<T>): boolean {
    return other.constructor.name === this.constructor.name && other.value === this.value;
  }

  public toString(): string {
    return this.value.toString();
  }
}
