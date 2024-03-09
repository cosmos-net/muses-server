import { ExceptionManager } from '@lib-commons/domain/exception-manager';

export class ModuleDisabledException extends ExceptionManager {
  constructor() {
    const message = 'The module is disabled';
    super(message, 'BAD_REQUEST');
  }
}
