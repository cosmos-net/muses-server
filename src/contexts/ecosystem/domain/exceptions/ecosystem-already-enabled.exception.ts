import { ExceptionManager } from '@core/domain/exception-manager';

export class EcosystemAlreadyEnabledException extends ExceptionManager {
  constructor() {
    const message = 'Ecosystem already enabled';
    super(message, 'BAD_REQUEST');
  }
}
