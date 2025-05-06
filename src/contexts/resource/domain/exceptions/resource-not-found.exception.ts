import { ExceptionManager } from '@core/domain/exception-manager';

export class ResourceNotFoundException extends ExceptionManager {
  constructor() {
    const message = 'Resource not found';

    super(message, 'NOT_FOUND');
  }
}
