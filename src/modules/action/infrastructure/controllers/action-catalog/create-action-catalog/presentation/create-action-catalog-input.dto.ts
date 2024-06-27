import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateActionCatalogInputDto {
  @Length(3, 50)
  @IsString()
  @IsNotEmpty()
  readonly name: string;
}
