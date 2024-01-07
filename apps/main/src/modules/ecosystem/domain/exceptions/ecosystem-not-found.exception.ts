import { ExceptionManager } from '@lib-commons/domain/exception-manager';

export class EcosystemNotFoundException {
  private readonly message = 'Ecosystem not found';

  constructor() {
    ExceptionManager.notFound(this.message);
  }
}
