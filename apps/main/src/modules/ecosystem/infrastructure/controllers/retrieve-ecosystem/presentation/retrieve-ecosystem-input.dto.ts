import { tryToTransformBooleanStringToBoolean } from '@lib-commons/infrastructure/helpers/utils';
import { Transform } from 'class-transformer';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class RetrieveEcosystemInputDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  id: string;

  @Transform(({ obj, key }) => tryToTransformBooleanStringToBoolean(obj[key]))
  @IsBoolean()
  @IsNotEmpty()
  @IsOptional()
  readonly withDeleted: boolean = true;

  set setId(value: string) {
    this.id = value;
  }
}
