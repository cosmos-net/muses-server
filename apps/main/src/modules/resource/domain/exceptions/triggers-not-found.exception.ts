import { ExceptionManager } from '@lib-commons/domain/exception-manager';

export class TriggersNotFoundException extends ExceptionManager {
  constructor() {
    const message = 'Triggers not found';

    super(message, 'NOT_FOUND');
  }
}
