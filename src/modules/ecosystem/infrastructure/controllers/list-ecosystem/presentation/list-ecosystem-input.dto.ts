import { tryToTransformBooleanStringToBoolean } from '@core/infrastructure/helpers/utils';
import { PaginationOptionsQuery } from '@core/infrastructure/presentation/input-pagination/pagination-options.dto';
import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsISO8601,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidationOptions,
  registerDecorator,
} from 'class-validator';

function ValidateBys(validationOptions?: ValidationOptions) {
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
            'name, description, enabled or createdAt'
          );
        },
      },
    });
  };
}

export class ListEcosystemInputDto extends PaginationOptionsQuery {
  @ValidateBys()
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  readonly orderBy: 'name' | 'description' | 'enabled' | 'createdAt' = 'createdAt';

  @IsString()
  @IsOptional()
  readonly name?: string;

  @IsString()
  @IsOptional()
  readonly description?: string;

  @Transform(({ obj, key }) => tryToTransformBooleanStringToBoolean(obj[key]))
  @IsBoolean()
  readonly isEnabled?: boolean = true;

  @IsISO8601()
  @IsOptional()
  readonly createdAtFrom: string;

  @IsISO8601()
  @IsOptional()
  readonly createdAtTo: string;
}
