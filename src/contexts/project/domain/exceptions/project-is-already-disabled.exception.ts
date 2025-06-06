import { ExceptionManager } from '@core/domain/exception-manager';

export class ProjectIsAlreadyDisabledException extends ExceptionManager {
  constructor() {
    const message = 'The project is already disabled';

    super(message, 'BAD_REQUEST');
  }
}
