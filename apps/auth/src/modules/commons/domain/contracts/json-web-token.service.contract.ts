import { SignJsonWebTokenType } from '@app-auth/modules/commons/domain/sign-json-web-token.type';

export interface IJsonWebTokenService {
  sign(signJsonWebTokenType: SignJsonWebTokenType): string;
  verify<T extends object>(token, secret): T;
}
