import { ExceptionManager } from '@core/domain/exception-manager';

export class ModuleDisabledException extends ExceptionManager {
  constructor() {
    const message = 'The module is disabled';

    super(message, 'BAD_REQUEST');
  }
}
