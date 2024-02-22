import { ExceptionManager } from '@lib-commons/domain/exception-manager';

export class ProjectDisabledException extends ExceptionManager {
  constructor() {
    const message = 'The project is disabled';

    super(message, 'BAD_REQUEST');
  }
}
