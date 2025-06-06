import { EnumMethodValue } from '@module-resource/domain/aggregate/value-objects/method.vo';
import { IsObjectIdHex } from '@core/infrastructure/helpers/custom-validators/object-id-hex';
import { IsArray, IsBoolean, IsEnum, IsNotEmpty, IsOptional, IsString, IsUrl, Length } from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateResourceInputDto {
  @IsObjectIdHex()
  @IsString()
  @IsNotEmpty()
  readonly id: string;

  @Length(3, 50)
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  readonly name?: string;

  @Length(8, 200)
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  readonly description?: string;

  @IsBoolean()
  @IsNotEmpty()
  @IsOptional()
  readonly isEnabled?: boolean;

  @IsUrl()
  @IsNotEmpty()
  @IsOptional()
  readonly endpoint?: string;

  @Transform(({ value }) => value.toUpperCase())
  @IsEnum(EnumMethodValue, {
    message: `method must be one of the following values: ${Object.values(EnumMethodValue).join(', ')}`,
  })
  @IsOptional()
  readonly method?: EnumMethodValue;

  @IsObjectIdHex()
  @IsString({ each: true })
  @IsArray()
  @IsOptional()
  readonly triggers?: string[];

  @IsObjectIdHex()
  @IsString({ each: true })
  @IsArray()
  @IsNotEmpty({ each: true, message: 'actions must not be empty' })
  @IsOptional()
  readonly actions?: string[];
}
