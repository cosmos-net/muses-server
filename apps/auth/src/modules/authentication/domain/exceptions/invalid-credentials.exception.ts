import { ExceptionManager } from '@lib-commons/domain/exception-manager';

export class InvalidCredentialsException extends ExceptionManager {
  constructor() {
    super('Invalid credentials', 'UNAUTHORIZED');
  }
}
