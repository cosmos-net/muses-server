import { ExceptionManager } from '@core/domain/exception-manager';

export class ResourceNameAlreadyUsedException extends ExceptionManager {
  constructor() {
    const message = 'Action name already used';
    super(message, 'BAD_REQUEST');
  }
}
