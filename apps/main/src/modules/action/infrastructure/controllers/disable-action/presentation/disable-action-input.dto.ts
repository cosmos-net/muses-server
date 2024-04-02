import { IsObjectIdHex } from '@lib-commons/infrastructure/helpers/custom-validators/object-id-hex';
import { IsNotEmpty, IsString } from 'class-validator';

export class DisableActionInputDto {
  @IsObjectIdHex()
  @IsString()
  @IsNotEmpty()
  readonly id: string;
}
