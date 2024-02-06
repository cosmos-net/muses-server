import { IsNotEmpty, IsString } from 'class-validator';

export class RetrieveEcosystemInputDto {
  @IsString()
  @IsNotEmpty()
  id: string;
}
