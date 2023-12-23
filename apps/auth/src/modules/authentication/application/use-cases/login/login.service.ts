import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
// TODO: FIX THIS WARNING: HANDLER IN INFRASTRUCTURE LAYER
// eslint-disable-next-line hexagonal-architecture/enforce
import { AuthModuleFacade } from '@app-auth/modules/main/infrastructure';
import { LoginCommand } from '@app-auth/modules/authentication/application';

// TODO: HANDLE TYPES CORRECTLY
interface PayloadTokenType extends jwt.JwtPayload {
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
    const { email, password, secret, expiresIn } = command;

    const user = await this.authModuleFacade.userModule.getUserByEmail({
      email: email,
    });

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const { id, uuid, roles } = user.toPrimitives();
    const sub = JSON.stringify({ id, uuid, roles, email });

    const payloadTokenType: PayloadTokenType = {
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
