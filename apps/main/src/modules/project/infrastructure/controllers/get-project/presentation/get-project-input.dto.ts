import { IsString, IsNotEmpty, IsBoolean, IsOptional } from 'class-validator';

// TODO: Validate id with custom validation, validating the id with a regex pattern will fail if the id is not a string and a with hex object id value
export class GetProjectInputDto {
  @IsString()
  @IsNotEmpty()
  readonly id: string;

  @IsBoolean()
  @IsNotEmpty()
  @IsOptional()
  readonly withDisabled: boolean = false;
}
