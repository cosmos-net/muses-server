import { IsObjectIdHex } from '@lib-commons/infrastructure/helpers/custom-validators/object-id-hex';
import { IsBoolean, IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';

export class UpdateModuleInputDto {
  @IsObjectIdHex()
  @IsString()
  @IsNotEmpty()
  readonly id: string;

  @Length(3, 50)
  @IsString()
  @IsOptional()
  readonly name?: string;

  @Length(8, 200)
  @IsString()
  @IsOptional()
  readonly description?: string;

  @IsBoolean()
  @IsOptional()
  readonly isEnabled?: boolean;

  @IsObjectIdHex()
  @IsString()
  @IsOptional()
  readonly project?: string;
}
