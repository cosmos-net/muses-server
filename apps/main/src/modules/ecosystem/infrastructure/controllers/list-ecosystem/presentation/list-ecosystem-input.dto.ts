import { PaginationOptionsQuery } from '@lib-commons/infrastructure';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsNotEmptyObject,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
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
            value === 'createdAt'
          );
        },
      },
    });
  };
}

class Params {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsBoolean()
  @IsOptional()
  enabled?: boolean;

  @IsDate()
  @IsOptional()
  createdAt?: Date | string;
}

export class ListEcosystemInputDto extends PaginationOptionsQuery {
  @validateBys()
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  orderBy: 'name' | 'description' | 'enabled' | 'createdAt' = 'name';

  @Type(() => Params)
  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  @IsOptional()
  filterBy?: Params;
}
