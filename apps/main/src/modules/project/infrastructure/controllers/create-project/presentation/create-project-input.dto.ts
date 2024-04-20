import { IsObjectIdHex } from '@lib-commons/infrastructure/helpers/custom-validators/object-id-hex';
import { Length, IsString, IsOptional, IsNotEmpty, IsBoolean } from 'class-validator';

export class CreateProjectInputDto {
  @Length(3, 50)
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @Length(8, 200)
  @IsString()
  @IsOptional()
  readonly description?: string;

  @IsObjectIdHex()
  @IsString()
  @IsOptional()
  readonly ecosystem?: string;

  @IsBoolean()
  @IsNotEmpty()
  @IsOptional()
  readonly isEnabled?: boolean;
}
