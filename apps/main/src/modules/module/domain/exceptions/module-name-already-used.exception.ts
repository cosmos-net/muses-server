import { ExceptionManager } from '@lib-commons/domain/exception-manager';

export class ModuleNameAlreadyUsedException extends ExceptionManager {
  constructor() {
    const message = 'Module name already used';
    super(message, 'BAD_REQUEST');
  }
}
