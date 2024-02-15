import { Length, IsString, IsOptional, IsBoolean, IsNotEmpty } from 'class-validator';

export class UpdateProjectInputDto {
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
  readonly ecosystem?: string;
}
