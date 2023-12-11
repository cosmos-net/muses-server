import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
// TODO: FIX THIS WARNING: HANDLER IN INFRASTRUCTURE LAYER
// eslint-disable-next-line hexagonal-architecture/enforce
import { AuthModuleFacade } from '@management-auth/modules/main/infrastructure/api-facade/auth-module.facade';
import { LoginCommand } from '@management-auth/modules/authentication/application/use-cases/login/login.command';

// TODO: HANDLE TYPES CORRECTLY
interface PayloadTokenType extends jwt.JwtPayload {
  roles: string[];
  sub: string;
}

type SignJsonWebTokenType = {
  payload: PayloadTokenType;
  secret: string;
  signOptions: jwt.SignOptions;
};

// TODO: THIS FUNCTION HAS A LOT RESPONSABILITY
@Injectable()
export class LogInService {
  constructor(private readonly authModuleFacade: AuthModuleFacade) {}

  private generateJsonWebToken(
    signJsonWebTokenType: SignJsonWebTokenType,
  ): string {
    const { payload, secret, signOptions } = signJsonWebTokenType;

    return jwt.sign(payload, secret, signOptions);
  }

  public async process(command: LoginCommand): Promise<string> {
    const { username, password, secret, expiresIn } = command;

    const user = await this.authModuleFacade.userModule.getUserByEmail({
      email: username,
    });

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const { id, uuid, roles } = user.toPrimitives();
    const sub = JSON.stringify({ id, uuid, roles });

    const payloadTokenType: PayloadTokenType = {
      roles,
      sub,
    };

    const payloadSignJsonWebTokenType: SignJsonWebTokenType = {
      payload: payloadTokenType,
      secret,
      signOptions: { expiresIn },
    };

    const token = this.generateJsonWebToken(payloadSignJsonWebTokenType);

    return token;
  }
}
