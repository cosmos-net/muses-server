import { ExceptionManager } from '@lib-commons/domain/exception-manager';
import { Primitives } from '@lib-commons/domain/value-object/value-object';

export class SubModulePropertyWithSameValueException extends ExceptionManager {
  constructor(property: string, value: Primitives) {
    const message = `The property ${property} already has the value ${value} assigned to it.`;
    super(message, 'BAD_REQUEST');
  }
}
