import { IPayloadTokenType } from '@app-auth/modules/common/domain/payload-token.interface';

export type IPayloadTokenDecodedType = IPayloadTokenType & {
  iat: number;
  exp: number;
};
