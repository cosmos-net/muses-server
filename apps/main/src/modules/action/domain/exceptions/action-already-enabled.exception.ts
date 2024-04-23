import { ExceptionManager } from '@lib-commons/domain/exception-manager';

export class ActionAlreadyEnabledException extends ExceptionManager {
  constructor() {
    const message = 'Action already enabled';
    super(message, 'BAD_REQUEST');
  }
}
