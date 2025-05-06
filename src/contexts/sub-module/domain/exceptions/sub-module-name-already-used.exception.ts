import { ExceptionManager } from '@core/domain/exception-manager';

export class SubModuleNameAlreadyUsedException extends ExceptionManager {
  constructor() {
    const message = 'Sub module name already used';
    super(message, 'BAD_REQUEST');
  }
}
