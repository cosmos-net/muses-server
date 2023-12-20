import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class ListEcosystemInputDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsBoolean()
  @IsNotEmpty()
  isEnabled: boolean;
}
