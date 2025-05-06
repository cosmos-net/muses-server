import { tryToTransformBooleanStringToBoolean } from '@core/infrastructure/helpers/utils';
import { Transform } from 'class-transformer';
import { IsString, IsNotEmpty, IsBoolean, IsOptional } from 'class-validator';

export class GetProjectInputDto {
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
