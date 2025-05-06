import { IsObjectIdHex } from '@core/infrastructure/helpers/custom-validators/object-id-hex';
import { IsBoolean, IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';

export class CreateModuleInputDto {
  @Length(3, 50)
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @Length(8, 200)
  @IsString()
  @IsNotEmpty()
  readonly description: string;

  @IsObjectIdHex()
  @IsString()
  @IsNotEmpty()
  readonly project: string;

  @IsBoolean()
  @IsOptional()
  readonly isEnabled?: boolean = true;
}
