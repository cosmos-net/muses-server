import { ExceptionManager } from '@core/domain/exception-manager';

export class ModuleAlreadyRelatedWithProject extends ExceptionManager {
  constructor() {
    const message = 'Module already related with project';

    super(message, 'BAD_REQUEST');
  }
}
