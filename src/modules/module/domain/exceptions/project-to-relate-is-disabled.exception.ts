import { ExceptionManager } from '@core/domain/exception-manager';

export class ProjectToRelateIsDisabledException extends ExceptionManager {
  constructor() {
    const message = 'Project to relate is disabled';
    super(message, 'BAD_REQUEST');
  }
}
