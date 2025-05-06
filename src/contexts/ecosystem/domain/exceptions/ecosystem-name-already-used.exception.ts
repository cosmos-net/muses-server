import { ExceptionManager } from '@core/domain/exception-manager';

export class EcosystemNameAlreadyUsedException extends ExceptionManager {
  constructor() {
    const message = 'Ecosystem name already used';
    super(message, 'BAD_REQUEST');
  }
}
