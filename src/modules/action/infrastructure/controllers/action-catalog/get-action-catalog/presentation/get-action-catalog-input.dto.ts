import { IsObjectIdHex } from '@core/infrastructure/helpers/custom-validators/object-id-hex';
import { IsOptional, IsString, Length, ValidateIf } from 'class-validator';

export class GetActionCatalogInputDto {
  @ValidateIf(
    (object) => object.id === undefined || object.id === null,
  )
  @Length(3, 50)
  @IsString()
  @IsOptional()
  readonly name?: string;

  @ValidateIf(
    (object) => object.name === undefined || object.name === null,
  )
  @IsObjectIdHex()
  @IsString()
  @IsOptional()
  readonly id?: string;
}
