import { ExceptionManager } from '@lib-commons/domain/exception-manager';
import { HttpStatus } from '@nestjs/common';

export class EcosystemNameAlreadyUsedException extends ExceptionManager {
  private static readonly message = 'Ecosystem name already used';
  private static readonly type: keyof typeof HttpStatus = 'BAD_REQUEST';

  constructor() {
    super(EcosystemNameAlreadyUsedException.message, EcosystemNameAlreadyUsedException.type);
  }
}
