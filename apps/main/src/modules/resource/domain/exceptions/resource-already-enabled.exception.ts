import { ExceptionManager } from '@lib-commons/domain/exception-manager';

export class ResourceAlreadyEnabledException extends ExceptionManager {
  constructor() {
    const message = 'Resource already enabled';
    super(message, 'BAD_REQUEST');
  }
}
