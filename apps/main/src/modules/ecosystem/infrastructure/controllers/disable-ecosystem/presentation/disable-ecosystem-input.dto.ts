import { IsObjectIdHex } from '@lib-commons/infrastructure/helpers/custom-validators/object-id-hex';
import { IsNotEmpty, IsString } from 'class-validator';

export class DisableEcosystemInputDto {
  @IsObjectIdHex()
  @IsString()
  @IsNotEmpty()
  readonly id: string;
}
