import { IsObjectIdHex } from '@core/infrastructure/helpers/custom-validators/object-id-hex';
import { tryToTransformBooleanStringToBoolean } from '@core/infrastructure/helpers/utils';
import { Transform } from 'class-transformer';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class RetrieveEcosystemInputDto {
  @IsObjectIdHex()
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  id: string;

  @Transform(({ obj, key }) => tryToTransformBooleanStringToBoolean(obj[key]))
  @IsBoolean()
  @IsNotEmpty()
  @IsOptional()
  readonly withDisabled: boolean = true;

  set setId(value: string) {
    this.id = value;
  }
}
