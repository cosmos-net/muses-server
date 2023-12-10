import { IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class GetHealthInputDto {
  @IsUrl()
  @IsNotEmpty()
  url: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  constructor(props: Partial<GetHealthInputDto>) {
    Object.assign(this, props);
  }
}
