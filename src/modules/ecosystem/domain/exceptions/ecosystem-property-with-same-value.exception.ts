import { ExceptionManager } from '@core/domain/exception-manager';
import { Primitives } from '@core/domain/value-object/value-object';

export class EcosystemPropertyWithSameValue extends ExceptionManager {
  constructor(property: string, value: Primitives) {
    const message = `The property ${property} already has the value ${value} assigned to it`;

    super(message, 'BAD_REQUEST');
  }
}
