import { IsObjectIdHex } from '@lib-commons/infrastructure/helpers/custom-validators/object-id-hex';
import { tryToTransformBooleanStringToBoolean } from '@lib-commons/infrastructure/helpers/utils';
import { PaginationOptionsQuery } from '@lib-commons/infrastructure/presentation/input-pagination/pagination-options.dto';
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

function ValidateBys(validationsOptions?: ValidationOptions) {
  // eslint-disable-next-line @typescript-eslint/ban-types
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationsOptions,
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

export class ListModuleInputDto extends PaginationOptionsQuery {
  @ValidateBys()
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
  readonly projects?: string[];

  @IsISO8601()
  @IsOptional()
  @IsNotEmpty()
  readonly createdAtFrom: string;

  @IsISO8601()
  @IsOptional()
  @IsNotEmpty()
  readonly createdAtTo: string;
}
