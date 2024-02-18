import { ExceptionManager } from '@lib-commons/domain/exception-manager';
import { HttpStatus } from '@nestjs/common';

export class ModuleNameAlreadyUsedException extends ExceptionManager {
  private static readonly message = 'Module name already used.';
  private static readonly type: keyof typeof HttpStatus = 'BAD_REQUEST';
  constructor() {
    super(ModuleNameAlreadyUsedException.message, ModuleNameAlreadyUsedException.type);
  }
}
