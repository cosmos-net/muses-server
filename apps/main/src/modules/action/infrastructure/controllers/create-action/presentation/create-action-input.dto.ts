import { IsObjectIdHex } from '@lib-commons/infrastructure/helpers/custom-validators/object-id-hex';
import { ArrayMinSize, IsArray, IsNotEmpty, IsString, Length, ValidateIf } from 'class-validator';

export class CreateActionInputDto {
  @Length(3, 50)
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @Length(8, 200)
  @IsString()
  @IsNotEmpty()
  readonly description: string;

  @ValidateIf(
    (object) => object.subModules === undefined || object.subModules === null || object.subModules.length === 0,
  )
  @IsObjectIdHex()
  @IsString({ each: true })
  @IsArray()
  @ArrayMinSize(1)
  readonly modules?: string[];

  @ValidateIf((object) => object.modules === undefined || object.modules === null || object.modules.length === 0)
  @IsObjectIdHex()
  @IsString({ each: true })
  @IsArray()
  @ArrayMinSize(1)
  readonly subModules?: string[];
}
