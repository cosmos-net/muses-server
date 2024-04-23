import { ExceptionManager } from '@lib-commons/domain/exception-manager';

export class ModuleIsAlreadyEnabledUsedException extends ExceptionManager {
  constructor() {
    const message = 'Module is already enabled';
    super(message, 'BAD_REQUEST');
  }
}
