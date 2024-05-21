import { IsObjectIdHex } from '@core/infrastructure/helpers/custom-validators/object-id-hex';
import { IsNotEmpty, IsString } from 'class-validator';

export class DisableResourceInputDto {
  @IsObjectIdHex()
  @IsString()
  @IsNotEmpty()
  readonly id: string;
}
