import { ExceptionManager } from '@lib-commons/domain/exception-manager';
import { HttpStatus } from '@nestjs/common';

export class ProjectAlreadyRelatedWithEcosystem extends ExceptionManager {
  private static readonly message = 'Project already related with ecosystem';
  private static readonly type: keyof typeof HttpStatus = 'BAD_REQUEST';

  constructor() {
    super(ProjectAlreadyRelatedWithEcosystem.message, ProjectAlreadyRelatedWithEcosystem.type);
  }
}
