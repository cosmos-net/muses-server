import { ExceptionManager } from '@lib-commons/domain/exception-manager';

export class UserRootNotDefinedException {
  private readonly message = 'User root not defined in config file';

  constructor() {
    ExceptionManager.badGateway(this.message);
  }
}
