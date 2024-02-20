import { IsBoolean, IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';

export class UpdateModuleInputDto {
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
  readonly enabled?: boolean;

  @IsString()
  @IsOptional()
  readonly project?: string;
}
