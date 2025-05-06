import { ExceptionManager } from '@core/domain/exception-manager';

export class SubModuleAlreadyRelatedWithModuleException extends ExceptionManager {
  constructor() {
    const message = 'SubModule already related with module';

    super(message, 'BAD_REQUEST');
  }
}
