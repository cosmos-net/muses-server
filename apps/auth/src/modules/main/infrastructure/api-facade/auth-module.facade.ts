import { UserModuleFacade } from '@app-auth/modules/user/infrastructure';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthModuleFacade {
  constructor(private readonly userModuleFacade: UserModuleFacade) {}

  get userModule() {
    return this.userModuleFacade;
  }
}
