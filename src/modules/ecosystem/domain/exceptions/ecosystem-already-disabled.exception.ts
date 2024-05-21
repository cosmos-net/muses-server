import { ExceptionManager } from '@core/domain/exception-manager';

export class EcosystemAlreadyDisabledException extends ExceptionManager {
  constructor() {
    super('Ecosystem already disabled', 'BAD_REQUEST');
  }
}
