import { ExceptionManager } from '@lib-commons/domain/exception-manager';
import { HttpStatus } from '@nestjs/common';

export class UrlNotFoundException extends ExceptionManager {
  private static readonly message = 'Url not defined';
  private static readonly type: keyof typeof HttpStatus = 'BAD_REQUEST';

  constructor() {
    super(UrlNotFoundException.message, UrlNotFoundException.type);
  }
}
