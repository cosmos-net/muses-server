import { ExceptionManager } from '@core/domain/exception-manager';

export class TriggersNotFoundException extends ExceptionManager {
  constructor() {
    const message = 'Triggers not found';

    super(message, 'NOT_FOUND');
  }
}
