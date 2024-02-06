import { Optional } from '@nestjs/common';
import { Length, IsString, IsOptional, IsBoolean, IsNotEmpty } from 'class-validator';

export class UpdateProjectInputDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @Length(3, 50)
  @IsString()
  @Optional()
  readonly name?: string;

  @Length(8, 200)
  @IsString()
  @IsOptional()
  readonly description?: string;

  @IsBoolean()
  @Optional()
  readonly enabled?: boolean;

  @IsString()
  @IsOptional()
  readonly ecosystem?: string;
}
