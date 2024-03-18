import { IsObjectIdHex } from '@lib-commons/infrastructure/helpers/custom-validators/object-id-hex';
import { IsArray, IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateActionInputDto {
  @IsObjectIdHex()
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  name: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  description: string;

  @IsBoolean()
  @IsNotEmpty()
  @IsOptional()
  isEnabled: boolean;

  @IsObjectIdHex()
  @IsArray()
  @IsNotEmpty()
  @IsOptional()
  subModules: string[];

  @IsObjectIdHex()
  @IsArray()
  @IsNotEmpty()
  @IsOptional()
  modules: string[];
}
