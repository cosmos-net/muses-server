import { Injectable } from '@nestjs/common';
import { GetUserService, GetUserQuery } from '@app-auth/modules/user/application';

@Injectable()
export class UserModuleFacade {
  constructor(private readonly getUserService: GetUserService) {}

  getUserByEmailOrUsername(getUserQuery: GetUserQuery) {
    return this.getUserService.process(getUserQuery);
  }
}
