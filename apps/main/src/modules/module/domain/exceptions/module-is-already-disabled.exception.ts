import { ExceptionManager } from '@lib-commons/domain/exception-manager';

export class ModuleIsAlreadyDisabledUsedException extends ExceptionManager {
  constructor() {
    const message = 'Module is already disabled';
    super(message, 'BAD_REQUEST');
  }
}
