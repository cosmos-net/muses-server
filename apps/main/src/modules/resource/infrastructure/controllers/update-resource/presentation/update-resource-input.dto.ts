import { EnumMethodValue } from '@module-resource/domain/aggregate/value-objects/method.vo';
import { IsObjectIdHex } from '@lib-commons/infrastructure/helpers/custom-validators/object-id-hex';
import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Length,
} from 'class-validator';
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
  @IsOptional()
  readonly triggers?: string[] = [];

  @IsObjectIdHex()
  @IsString({ each: true })
  @IsArray()
  @ArrayMinSize(1)
  @IsOptional()
  readonly actions?: string[] = [];
}
