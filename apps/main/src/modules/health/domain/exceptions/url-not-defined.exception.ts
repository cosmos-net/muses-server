import { ExceptionManager } from '@lib-commons/domain/exception-manager';

export class UrlNotFoundException {
  private readonly message = 'Url not defined';

  constructor() {
    ExceptionManager.badRequest(this.message);
  }
}
