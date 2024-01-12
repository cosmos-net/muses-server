import { ExceptionManager } from '@lib-commons/domain/exception-manager';
import { HttpStatus } from '@nestjs/common';

export class UserRootNotDefinedException extends ExceptionManager {
  private static readonly message = 'User root not defined in config file';
  private static readonly type: keyof typeof HttpStatus = 'BAD_GATEWAY';

  constructor() {
    super(UserRootNotDefinedException.message, UserRootNotDefinedException.type);
  }
}
