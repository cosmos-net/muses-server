import { ExceptionManager } from '@core/domain/exception-manager';

export class SubModuleDisabledException extends ExceptionManager {
  constructor() {
    const message = 'The submodule is disabled';

    super(message, 'BAD_REQUEST');
  }
}
