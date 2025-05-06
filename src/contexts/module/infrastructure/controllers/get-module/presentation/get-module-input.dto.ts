import { IsObjectIdHex } from '@core/infrastructure/helpers/custom-validators/object-id-hex';
import { tryToTransformBooleanStringToBoolean } from '@core/infrastructure/helpers/utils';
import { Transform } from 'class-transformer';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';


export class GetModuleInputDto {
  @IsObjectIdHex()
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  readonly id: string;

  @Transform(({ obj, key }) => tryToTransformBooleanStringToBoolean(obj[key]))
  @IsBoolean()
  @IsNotEmpty()
  @IsOptional()
  readonly withDisabled?: boolean = false;
}