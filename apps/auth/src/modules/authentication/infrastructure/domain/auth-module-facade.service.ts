import { IAuthModuleFacadeService } from '@app-auth/modules/authentication/domain/contracts/auth-module-facade-service.contract';
import { AuthModuleFacade } from '@app-auth/modules/main/infrastructure/api-facade/auth-module.facade';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthModuleFacadeService implements IAuthModuleFacadeService {
  constructor(private readonly authModuleFacade: AuthModuleFacade) {}

  async getUserByEmailOrUsername(
    emailOrUsername: string,
  ): Promise<{ id: number; uuid: string; roles: string[]; password: string; username: string; email: string }> {
    const user = await this.authModuleFacade.userModule.getUserByEmailOrUsername({
      emailOrUsername,
    });

    return {
      ...user.toPrimitives(),
    };
  }
}
