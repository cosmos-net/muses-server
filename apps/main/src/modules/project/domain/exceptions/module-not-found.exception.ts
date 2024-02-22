import { ExceptionManager } from '@lib-commons/domain/exception-manager';

export class ModuleNotFoundException extends ExceptionManager {
  constructor() {
    const message = 'Module not found';

    super(message, 'NOT_FOUND');
  }
}
