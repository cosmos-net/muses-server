import { ExceptionManager } from '@lib-commons/domain/exception-manager';

export class EcosystemAlreadyDisabledException extends ExceptionManager {
  constructor() {
    super('Ecosystem already disabled', 'BAD_REQUEST');
  }
}
