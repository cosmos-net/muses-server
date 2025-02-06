import { IsObjectIdHex } from '@core/infrastructure/helpers/custom-validators/object-id-hex';
import { IsArray, IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateActionInputDto {
  @IsObjectIdHex()
  @IsString()
  @IsNotEmpty()
  readonly id: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  readonly name?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  readonly description?: string;

  @IsBoolean()
  @IsNotEmpty()
  @IsOptional()
  readonly isEnabled?: boolean;

  @IsObjectIdHex()
  @IsNotEmpty()
  @IsOptional()
  readonly submodule?: string;

  @IsObjectIdHex()
  @IsNotEmpty()
  @IsOptional()
  readonly module?: string;

  @IsObjectIdHex()
  @IsString()
  @IsOptional()
  readonly actionCatalog?: string;
}
