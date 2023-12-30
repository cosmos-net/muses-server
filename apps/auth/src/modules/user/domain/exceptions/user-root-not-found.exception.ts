import { ExceptionManager } from '@lib-commons/domain/exception-manager';

export class UserRootNotFoundException {
  private readonly message = 'USER_NOT_FOUND';

  constructor() {
    ExceptionManager.badGateway(this.message);
  }
}
