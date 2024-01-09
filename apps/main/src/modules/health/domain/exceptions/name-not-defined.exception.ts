import { ExceptionManager } from '@lib-commons/domain/exception-manager';

export class NameNotFoundException {
  private readonly message = 'Name not defined';

  constructor() {
    ExceptionManager.badRequest(this.message);
  }
}
