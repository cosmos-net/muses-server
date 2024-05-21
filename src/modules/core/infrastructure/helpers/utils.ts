import { BadRequestException } from '@nestjs/common';
import { isArray, isBoolean } from 'class-validator';
import { error } from 'console';

export function tryToTransformBooleanStringToBoolean(value: string | boolean): boolean | string {
  if (!isBoolean(value)) {
    if (value !== 'true' && value !== 'false') {
      throw new BadRequestException('The value must be a boolean');
    }

    if (value === 'true') return true;
    if (value === 'false') return false;
  }
  return value;
}

export function tryToTransformDatesStringToTwoDatesString(value: string | Array<any>): string[] {
  if (!isArray(value)) {
    try {
      const [from, to] = value.split(',');

      if (from.length === 0 || to.length === 0) {
        throw new error();
      }

      return [from, to];
    } catch (e) {
      throw new BadRequestException('The value must be a valid date');
    }
  }

  return value;
}
