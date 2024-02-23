import { IsNotEmpty, IsString } from 'class-validator';

export class DeleteModuleInputDto {
  @IsString()
  @IsNotEmpty()
  readonly id: string;
}
