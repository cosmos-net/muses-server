import { ExceptionManager } from '@lib-commons/domain/exception-manager';
import { Primitives } from '@lib-commons/domain/value-object/value-object';

export class ResourcePropertyWithSameValueException extends ExceptionManager {
  constructor(property: string, value: Primitives | Primitives[]) {
    const message = `The property ${property} already has the value${Array.isArray(value) ? 's' : ''} ${
      Array.isArray(value) ? value.join(', ') : value
    }`;

    super(message, 'BAD_REQUEST');
  }
}
