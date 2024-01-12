import { ExceptionManager } from '@lib-commons/domain/exception-manager';
import { HttpStatus } from '@nestjs/common';

export class EcosystemAlreadyDeletedException extends ExceptionManager {
  private static readonly message = 'Ecosystem already deleted';
  private static readonly type: keyof typeof HttpStatus = 'BAD_REQUEST';

  constructor() {
    super(EcosystemAlreadyDeletedException.message, EcosystemAlreadyDeletedException.type);
  }
}
