import { ExceptionManager } from '@lib-commons/domain/exception-manager';
import { HttpStatus } from '@nestjs/common';

export class ProjectNameAlreadyUsedException extends ExceptionManager {
  private static readonly message = 'Project name already used';
  private static readonly type: keyof typeof HttpStatus = 'BAD_REQUEST';

  constructor() {
    super(ProjectNameAlreadyUsedException.message, ProjectNameAlreadyUsedException.type);
  }
}
