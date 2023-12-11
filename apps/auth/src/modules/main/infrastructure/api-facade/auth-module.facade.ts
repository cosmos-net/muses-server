import { UserModuleFacade } from '@management-auth/modules/user/infrastructure/api-facade/user-module.facade';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthModuleFacade {
  constructor(private readonly userModuleFacade: UserModuleFacade) {}

  get userModule() {
    return this.userModuleFacade;
  }
}
