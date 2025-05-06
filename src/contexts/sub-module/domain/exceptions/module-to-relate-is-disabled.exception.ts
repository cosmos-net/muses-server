import { ExceptionManager } from '@core/domain/exception-manager';

export class ModuleToRelateIsDisabledException extends ExceptionManager {
  constructor() {
    const message = 'Module to relate is disabled';
    super(message, 'BAD_REQUEST');
  }
}
