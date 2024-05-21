import { ExceptionManager } from '@core/domain/exception-manager';

export class EcosystemNotFoundException extends ExceptionManager {
  constructor() {
    const message = 'Ecosystem not found';
    super(message, 'NOT_FOUND');
  }
}
