import { IsNotEmpty, IsString } from 'class-validator';

export class DisableModuleInputDto {
  @IsString()
  @IsNotEmpty()
  readonly id: string;
}
