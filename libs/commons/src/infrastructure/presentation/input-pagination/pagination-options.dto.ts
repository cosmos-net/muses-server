import { Transform, Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, Max, Min } from 'class-validator';
import { SortEnum } from '@lib-commons/domain/list/order/sort.enum';

export class PaginationOptionsQuery {
  @Transform(({ value }) => value.toUpperCase())
  @IsEnum(SortEnum, {
    message: 'Sort options are not supported, only ASC or DESC',
  })
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
