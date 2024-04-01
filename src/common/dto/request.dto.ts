import { IsOptional, MinLength } from 'class-validator';

export class QueryPaginatedParamsDto {
  @IsOptional()
  @MinLength(1)
  page: number;

  @MinLength(1)
  @IsOptional()
  limit: number;
}
