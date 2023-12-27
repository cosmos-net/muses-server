import { IsNotEmpty, IsString } from 'class-validator';

export class ValidatePasswordInputDto {
  @IsString()
  @IsNotEmpty()
  password: string;

  constructor(props: Partial<ValidatePasswordInputDto>) {
    Object.assign(this, props);
  }
}
