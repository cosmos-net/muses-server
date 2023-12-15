import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class UpdateEcosystemInputDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsBoolean()
  @IsNotEmpty()
  isEnabled: boolean;

  constructor(props: Partial<UpdateEcosystemInputDto>) {
    Object.assign(this, props);
  }
}
