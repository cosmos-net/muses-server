import { Inject, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { LoginCommand } from '@app-auth/modules/authentication/application';
import {
  AUTH_MODULE_FACADE_SERVICE,
  JSON_WEB_TOKEN_SERVICE,
} from '@app-auth/modules/authentication/application/use-cases/constants/injection-tokens';
import { IAuthModuleFacadeService } from '@app-auth/modules/authentication/domain/contracts/auth-module-facade-service.contract';
import { IJsonWebTokenService } from '@app-auth/modules/common/domain/contracts/json-web-token.service.contract';
import { InvalidCredentialsException } from '@app-auth/modules/authentication/domain/exceptions/invalid-credentials.exception';
@Injectable()
export class LogInService {
  constructor(
    @Inject(AUTH_MODULE_FACADE_SERVICE)
    private readonly authModuleFacadeService: IAuthModuleFacadeService,
    @Inject(JSON_WEB_TOKEN_SERVICE)
    private readonly jsonWebTokenService: IJsonWebTokenService,
  ) {}

  public async process(command: LoginCommand): Promise<string> {
    const { email, password, secret, expiresIn } = command;

    const user = await this.authModuleFacadeService.getUserByEmailOrUsername(email);

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      throw new InvalidCredentialsException();
    }

    const token = this.jsonWebTokenService.sign({
      payload: {
        id: user.id,
        uuid: user.uuid,
        roles: user.roles,
        email: user.email,
        username: user.username,
      },
      secret,
      signOptions: { expiresIn },
    });

    return token;
  }
}
