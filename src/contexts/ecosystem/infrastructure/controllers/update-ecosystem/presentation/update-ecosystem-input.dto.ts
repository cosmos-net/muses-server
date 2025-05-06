import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateEcosystemInputDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  name?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  description?: string;

  @IsBoolean()
  @IsNotEmpty()
  @IsOptional()
  isEnabled?: boolean;

  constructor(props: Partial<UpdateEcosystemInputDto>) {
    Object.assign(this, props);
  }
}
