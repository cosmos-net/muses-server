import { ExceptionManager } from '@lib-commons/domain/exception-manager';

export class ResourceNameAlreadyUsedException extends ExceptionManager {
  constructor() {
    const message = 'Action name already used';
    super(message, 'BAD_REQUEST');
  }
}
