import { ExceptionManager } from '@lib-commons/domain/exception-manager';

export class UserRootAlreadyDefinedException {
  private readonly message = 'User root already defined';

  constructor() {
    ExceptionManager.badGateway(this.message);
  }
}
