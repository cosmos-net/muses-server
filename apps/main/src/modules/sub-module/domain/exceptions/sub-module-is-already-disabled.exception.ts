import { ExceptionManager } from '@lib-commons/domain/exception-manager';

export class SubModuleIsAlreadyDisabledUsedException extends ExceptionManager {
  constructor() {
    const message = 'Sub Module name already used';
    super(message, 'BAD_REQUEST');
  }
}
