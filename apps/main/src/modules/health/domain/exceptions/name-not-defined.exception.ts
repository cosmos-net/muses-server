import { ExceptionManager } from '@lib-commons/domain/exception-manager';
import { HttpStatus } from '@nestjs/common';

export class NameNotFoundException extends ExceptionManager {
  private static readonly message = 'Name not defined';
  private static readonly type: keyof typeof HttpStatus = 'BAD_REQUEST';

  constructor() {
    super(NameNotFoundException.message, NameNotFoundException.type);
  }
}
