import { ExceptionManager } from '@lib-commons/domain/exception-manager';
import { HttpStatus } from '@nestjs/common';

export class InvalidCredentialsException extends ExceptionManager {
  private static readonly message = 'Invalid credentials';
  private static readonly type: keyof typeof HttpStatus = 'UNAUTHORIZED';
  constructor() {
    super(InvalidCredentialsException.message, InvalidCredentialsException.type);
  }
}
