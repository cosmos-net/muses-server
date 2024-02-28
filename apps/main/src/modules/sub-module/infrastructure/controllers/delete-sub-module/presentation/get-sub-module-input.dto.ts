import { IsNotEmpty, IsString } from 'class-validator';

export class DeleteSubModuleInputDto {
  @IsString()
  @IsNotEmpty()
  readonly id: string;
}
