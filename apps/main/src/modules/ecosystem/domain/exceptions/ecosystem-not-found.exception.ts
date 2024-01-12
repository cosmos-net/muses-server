import { ExceptionManager } from '@lib-commons/domain/exception-manager';
import { HttpStatus } from '@nestjs/common';

export class EcosystemNotFoundException extends ExceptionManager {
  private static readonly message = 'Ecosystem not found';
  private static readonly type: keyof typeof HttpStatus = 'NOT_FOUND';

  constructor() {
    super(EcosystemNotFoundException.message, EcosystemNotFoundException.type);
  }
}
