import { ExceptionManager } from '@lib-commons/domain/exception-manager';
import { HttpStatus } from '@nestjs/common';

export class ProjectNotFoundException extends ExceptionManager {
  private static readonly message = 'Project not found';
  private static readonly type: keyof typeof HttpStatus = 'NOT_FOUND';

  constructor() {
    super(ProjectNotFoundException.message, ProjectNotFoundException.type);
  }
}
