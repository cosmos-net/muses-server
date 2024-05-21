import { EnumMethodValue } from '@module-resource/domain/aggregate/value-objects/method.vo';
import { IsObjectIdHex } from '@core/infrastructure/helpers/custom-validators/object-id-hex';
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

export class CreateResourceInputDto {
  @Length(3, 50)
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @Length(8, 200)
  @IsString()
  @IsNotEmpty()
  readonly description: string;

  @IsBoolean()
  @IsNotEmpty()
  readonly isEnabled: boolean;

  @IsUrl()
  @IsNotEmpty()
  readonly endpoint: string;

  @Transform(({ value }) => value.toUpperCase())
  @IsEnum(EnumMethodValue, {
    message: `method must be one of the following values: ${Object.values(EnumMethodValue).join(', ')}`,
  })
  readonly method: EnumMethodValue;

  @IsObjectIdHex()
  @IsString({ each: true })
  @IsArray()
  @IsOptional()
  readonly triggers?: string[] = [];

  @IsObjectIdHex()
  @IsString({ each: true })
  @IsArray()
  @ArrayMinSize(1)
  readonly actions: string[] = [];
}
