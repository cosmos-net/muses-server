import { IsObjectIdHex } from '@core/infrastructure/helpers/custom-validators/object-id-hex';
import { tryToTransformBooleanStringToBoolean } from '@core/infrastructure/helpers/utils';
import { PaginationOptionsQuery } from '@core/infrastructure/presentation/input-pagination/pagination-options.dto';
import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsISO8601,
  IsNotEmpty,
  IsOptional,
  IsString,
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
          return value === 'name' || value === 'description' || value === 'enabled' || value === 'createdAt';
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

export class ListActionInputDto extends PaginationOptionsQuery {
  @validateBys()
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  readonly orderBy: 'name' | 'description' | 'enabled' | 'createdAt' = 'createdAt';

  @Length(1, 50)
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  readonly name: string;

  @Length(1, 200)
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  readonly description: string;

  @Transform(({ obj, key }) => tryToTransformBooleanStringToBoolean(obj[key]))
  @IsBoolean()
  @IsOptional()
  readonly isEnabled?: boolean = true;

  @Transform(({ value }) => {
    return typeof value === 'string' ? value.split(',') : value;
  })
  @IsObjectIdHex()
  @IsString({ each: true })
  @IsOptional()
  readonly subModules?: string[];

  @Transform(({ value }) => {
    return typeof value === 'string' ? value.split(',') : value;
  })
  @IsObjectIdHex()
  @IsString({ each: true })
  @IsOptional()
  readonly modules?: string[];

  @IsISO8601()
  @IsOptional()
  @IsNotEmpty()
  readonly createdAtFrom: string;

  @IsISO8601()
  @IsOptional()
  @IsNotEmpty()
  readonly createdAtTo: string;
}
