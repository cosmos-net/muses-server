import { Type } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';
import { SortEnum } from '@lib-commons/infrastructure';

export class PaginationOptionsQuery {
  @IsOptional()
  readonly sort: SortEnum = SortEnum.ASC;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  readonly page: number = 1;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  @IsOptional()
  readonly limit: number = 10;

  get offset(): number {
    return (this.page - 1) * this.limit;
  }
}
