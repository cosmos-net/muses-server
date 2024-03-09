import { ExceptionManager } from '@lib-commons/domain/exception-manager';

export class SubModuleDisabledException extends ExceptionManager {
  constructor() {
    const message = 'The submodule is disabled';

    super(message, 'BAD_REQUEST');
  }
}
