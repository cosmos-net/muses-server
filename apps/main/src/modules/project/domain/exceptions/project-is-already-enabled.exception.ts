import { ExceptionManager } from '@lib-commons/domain/exception-manager';

export class ProjectIsAlreadyEnabledException extends ExceptionManager {
  constructor() {
    const message = 'The project is already enabled';

    super(message, 'BAD_REQUEST');
  }
}
