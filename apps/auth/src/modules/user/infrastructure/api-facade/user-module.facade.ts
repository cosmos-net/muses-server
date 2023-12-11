import { Injectable } from '@nestjs/common';
import { GetUserService } from '@management-auth/modules/user/application/use-cases/get-user/get-user.service';
import { GetUserQuery } from '@management-auth/modules/user/application/use-cases/get-user/get-user.query';

@Injectable()
export class UserModuleFacade {
  constructor(private readonly getUserService: GetUserService) {}

  getUserByEmail(getUserQuery: GetUserQuery) {
    return this.getUserService.process(getUserQuery);
  }
}
