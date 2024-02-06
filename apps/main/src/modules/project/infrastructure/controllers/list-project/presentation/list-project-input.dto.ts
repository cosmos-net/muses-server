import { PaginationOptionsQuery } from '@lib-commons/infrastructure';
import { tryToTransformBooleanStringToBoolean } from '@lib-commons/infrastructure/helpers/utils';
import { Transform } from 'class-transformer';
import {
  Length,
  IsString,
  IsOptional,
  IsNotEmpty,
  IsBoolean,
  IsISO8601,
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

export class ListProjectInputDto extends PaginationOptionsQuery {
  @ValidateBys()
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  readonly orderBy: 'name' | 'description' | 'enabled' | 'createdAt' = 'createdAt';

  @Length(3, 50)
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  readonly name?: string;

  @Length(8, 200)
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  readonly description?: string;

  @Transform(({ obj, key }) => tryToTransformBooleanStringToBoolean(obj[key]))
  @IsBoolean()
  @IsOptional()
  readonly isEnabled?: boolean = true;

  @IsISO8601()
  @IsOptional()
  @IsNotEmpty()
  readonly createdAtFrom: string;

  @IsISO8601()
  @IsOptional()
  @IsNotEmpty()
  readonly createdAtTo: string;
}
