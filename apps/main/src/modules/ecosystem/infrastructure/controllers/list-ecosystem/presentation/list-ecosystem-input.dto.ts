import { PaginationOptionsQuery } from '@lib-commons/infrastructure';
import { transformIsEnabled } from '@lib-commons/infrastructure/helpers/utils';
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
  orderBy: 'name' | 'description' | 'enabled' | 'createdAt' = 'name';

  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @Transform(({ obj, key }) => transformIsEnabled(obj[key]))
  @IsBoolean()
  @IsOptional()
  isEnabled?: boolean;

  @IsISO8601()
  @IsOptional()
  createdAt?: string;

  @IsISO8601()
  @IsOptional()
  createdAtTo?: string;
}
