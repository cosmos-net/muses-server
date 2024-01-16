import { ExceptionManager } from '@lib-commons/domain/exception-manager';
import { HttpStatus } from '@nestjs/common';

export class UserRootAlreadyDefinedException extends ExceptionManager {
  private static readonly message = 'User root already defined';
  private static readonly type: keyof typeof HttpStatus = 'BAD_GATEWAY';

  constructor() {
    super(UserRootAlreadyDefinedException.message, UserRootAlreadyDefinedException.type);
  }
}
