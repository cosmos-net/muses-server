import { ExceptionManager } from '@core/domain/exception-manager';

export class EcosystemDoesNotHaveProjectAddedException extends ExceptionManager {
  constructor() {
    super('Ecosystem does not have project added', 'BAD_REQUEST');
  }
}
