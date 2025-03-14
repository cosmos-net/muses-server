import { ExceptionManager } from '@core/domain/exception-manager';

export class ModuleNotFoundException extends ExceptionManager {
  constructor() {
    const message = 'Module not found';

    super(message, 'NOT_FOUND');
  }
}
