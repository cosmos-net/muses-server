import { ExceptionManager } from '@lib-commons/domain/exception-manager';

export class ActionNotFoundException extends ExceptionManager {
  constructor() {
    const message = 'Action not found';

    super(message, 'NOT_FOUND');
  }
}
