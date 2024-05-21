import { IsString, IsNotEmpty } from 'class-validator';

export class DeleteProjectInputDto {
  @IsString()
  @IsNotEmpty()
  readonly id: string;
}
