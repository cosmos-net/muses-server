import { PaginationOptionsQuery } from '@lib-commons/infrastructure';
import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
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

  @Transform(({ obj, key }) => {
    return obj[key] === 'true' ? true : obj[key] === 'false' ? false : obj[key];
  })
  @IsBoolean()
  @IsOptional()
  enabled?: boolean;

  @IsDate()
  @IsOptional()
  createdAt?: Date | string;
}
