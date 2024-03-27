import { IsObjectIdHex } from '@lib-commons/infrastructure/helpers/custom-validators/object-id-hex';
import { IsArray, IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';

export class CreateActionInputDto {
  @Length(3, 50)
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @Length(8, 200)
  @IsString()
  @IsNotEmpty()
  readonly description: string;

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
