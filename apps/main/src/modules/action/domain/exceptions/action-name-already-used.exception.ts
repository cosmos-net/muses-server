import { ExceptionManager } from '@lib-commons/domain/exception-manager';

export class ActionNameAlreadyUsedException extends ExceptionManager {
  constructor() {
    const message = 'Action name already used';
    super(message, 'BAD_REQUEST');
  }
}
