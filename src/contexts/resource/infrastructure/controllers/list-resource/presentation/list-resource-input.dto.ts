import { EnumMethodValue } from '@module-resource/domain/aggregate/value-objects/method.vo';
import { IsObjectIdHex } from '@core/infrastructure/helpers/custom-validators/object-id-hex';
import { tryToTransformBooleanStringToBoolean } from '@core/infrastructure/helpers/utils';
import { PaginationOptionsQuery } from '@core/infrastructure/presentation/input-pagination/pagination-options.dto';
import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsISO8601,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Length,
  ValidationOptions,
  registerDecorator,
} from 'class-validator';

function validateBys(validationOptions?: ValidationOptions) {
  // eslint-disable-next-line @typescript-eslint/ban-types
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: {
        validate(value: any) {
          return (
            value === 'name' ||
            value === 'description' ||
            value === 'enabled' ||
            value === 'createdAt' ||
            value === 'updatedAt' ||
            value === 'deletedAt' ||
            value === 'endpoint' ||
            value === 'method'
          );
        },
        defaultMessage() {
          return (
            'The property ' +
            propertyName +
            ' must be a valid value, only can be ' +
            'name, description, enabled, createdAt'
          );
        },
      },
    });
  };
}

export class ListResourceInputDto extends PaginationOptionsQuery {
  @validateBys()
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  readonly orderBy?:
    | 'name'
    | 'description'
    | 'enabled'
    | 'createdAt'
    | 'updatedAt'
    | 'deletedAt'
    | 'endpoint'
    | 'method' = 'createdAt';

  @Length(1, 50)
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  readonly name?: string;

  @Length(1, 200)
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  readonly description?: string;

  @Transform(({ obj, key }) => tryToTransformBooleanStringToBoolean(obj[key]))
  @IsBoolean()
  @IsOptional()
  readonly isEnabled?: boolean = true;

  @IsUrl()
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  readonly endpoint?: string;

  @IsEnum(EnumMethodValue, {
    message: `method must be one of the following values: ${Object.values(EnumMethodValue).join(', ')}`,
  })
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  readonly method?: EnumMethodValue;

  @Transform(({ value }) => {
    return typeof value === 'string' ? value.split(',') : value;
  })
  @IsString({ each: true })
  @IsObjectIdHex()
  @IsOptional()
  @IsNotEmpty()
  actions?: string[];

  @Transform(({ value }) => {
    return typeof value === 'string' ? value.split(',') : value;
  })
  @IsString({ each: true })
  @IsObjectIdHex()
  @IsOptional()
  @IsNotEmpty()
  triggers?: string[];

  @IsISO8601()
  @IsOptional()
  @IsNotEmpty()
  readonly createdAtFrom?: string;

  @IsISO8601()
  @IsOptional()
  @IsNotEmpty()
  readonly createdAtTo?: string;

  @IsISO8601()
  @IsOptional()
  @IsNotEmpty()
  readonly updatedAtFrom?: string;

  @IsISO8601()
  @IsOptional()
  @IsNotEmpty()
  readonly updatedAtTo?: string;

  @IsISO8601()
  @IsOptional()
  @IsNotEmpty()
  readonly deletedAtFrom?: string;

  @IsISO8601()
  @IsOptional()
  @IsNotEmpty()
  readonly deletedAtTo?: string;
}
