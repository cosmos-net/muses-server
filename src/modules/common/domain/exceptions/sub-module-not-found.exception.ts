import { ExceptionManager } from '@core/domain/exception-manager';

export class SubModuleNotFoundException extends ExceptionManager {
  constructor() {
    const message = 'Sub Module not found';

    super(message, 'NOT_FOUND');
  }
}
