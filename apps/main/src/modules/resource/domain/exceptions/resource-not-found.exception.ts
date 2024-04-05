import { ExceptionManager } from '@lib-commons/domain/exception-manager';

export class ResourceNotFoundException extends ExceptionManager {
  constructor() {
    const message = 'Resource not found';

    super(message, 'NOT_FOUND');
  }
}
