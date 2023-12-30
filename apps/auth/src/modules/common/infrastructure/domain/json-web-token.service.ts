import * as jwt from 'jsonwebtoken';
import { Injectable } from '@nestjs/common';
import { SignJsonWebTokenType } from '@app-auth/modules/common/domain/sign-json-web-token.type';
import { IJsonWebTokenService } from '@app-auth/modules/common/domain/contracts/json-web-token.service.contract';

@Injectable()
export class JsonWebTokenService implements IJsonWebTokenService {
  sign(signJsonWebTokenType: SignJsonWebTokenType): string {
    const { payload, secret, signOptions } = signJsonWebTokenType;
    const token = jwt.sign(payload, secret, signOptions);
    return token;
  }

  verify<T extends object>(token, secret): T {
    const payload = jwt.verify(token, secret);
    return payload as T;
  }
}
