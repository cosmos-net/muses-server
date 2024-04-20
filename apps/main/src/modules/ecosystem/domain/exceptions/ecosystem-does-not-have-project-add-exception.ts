import { ExceptionManager } from '@lib-commons/domain/exception-manager';

export class EcosystemDoesNotHaveProjectAddedException extends ExceptionManager {
  constructor() {
    super('Ecosystem does not have project added', 'BAD_REQUEST');
  }
}
