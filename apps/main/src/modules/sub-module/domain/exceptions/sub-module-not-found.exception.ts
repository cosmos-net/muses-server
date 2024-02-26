import { ExceptionManager } from '@lib-commons/domain/exception-manager';

export class SunModuleNotFoundException extends ExceptionManager {
  constructor() {
    const message = 'Module not found';

    super(message, 'NOT_FOUND');
  }
}
