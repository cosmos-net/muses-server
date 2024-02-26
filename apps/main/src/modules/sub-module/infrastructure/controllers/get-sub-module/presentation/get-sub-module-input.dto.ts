import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class GetModuleInputDto {
  @IsString()
  @IsNotEmpty()
  readonly id: string;

  @IsBoolean()
  @IsOptional()
  readonly withDisabled?: boolean = false;
}
