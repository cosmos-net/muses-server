import { IPayloadTokenType } from '@app-auth/modules/commons/domain/payload-token.interface';

export type IPayloadTokenDecodedType = IPayloadTokenType & {
  iat: number;
  exp: number;
};
