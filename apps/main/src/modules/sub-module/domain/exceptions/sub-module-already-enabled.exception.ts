import { ExceptionManager } from '@lib-commons/domain/exception-manager';

export class SubModuleAlreadyEnabledException extends ExceptionManager {
  constructor() {
    const message = 'SubModule already enabled';
    super(message, 'BAD_REQUEST');
  }
}
