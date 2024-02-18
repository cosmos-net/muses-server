import { GetUserQuery } from '@module-user/application/use-cases/get-user/get-user.query';
import { GetUserService } from '@module-user/application/use-cases/get-user/get-user.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserModuleFacade {
  constructor(private readonly getUserService: GetUserService) {}

  getUserByEmailOrUsername(getUserQuery: GetUserQuery) {
    return this.getUserService.process(getUserQuery);
  }
}
