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

  @IsString()
  @IsOptional()
  readonly ecosystem?: string;

  @IsBoolean()
  @IsNotEmpty()
  readonly enabled: boolean;
}
