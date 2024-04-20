import { ExceptionManager } from '@lib-commons/domain/exception-manager';

export class EcosystemAlreadyHasProjectAddedException extends ExceptionManager {
  constructor() {
    super('Ecosystem already has project added', 'BAD_REQUEST');
  }
}
