import { ExceptionManager } from '@core/domain/exception-manager';

export class ModuleAlreadyRelatedWithProjectException extends ExceptionManager {
  constructor() {
    const message = 'The module is already related with the project';

    super(message, 'BAD_REQUEST');
  }
}
