import { ExceptionManager } from '@core/domain/exception-manager';

export class ActionNameAlreadyUsedException extends ExceptionManager {
  constructor() {
    const message = 'Action name already used';
    super(message, 'BAD_REQUEST');
  }
}
