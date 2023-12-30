import { IPayloadTokenType } from '@app-auth/modules/common/domain/payload-token.interface';

export type SignJsonWebTokenType = {
  payload: IPayloadTokenType;
  secret: string;
  signOptions: Record<string, unknown>;
};
