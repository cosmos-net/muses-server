import { IsObjectIdHex } from '@core/infrastructure/helpers/custom-validators/object-id-hex';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class GetActionInputDto {
  @IsObjectIdHex()
  @IsString()
  @IsNotEmpty()
  readonly id: string;

  @IsBoolean()
  @IsOptional()
  readonly withDisabled?: boolean = false;
}
