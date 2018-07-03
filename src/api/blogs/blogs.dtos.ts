import { Type } from 'class-transformer';
import { IsNumberString, IsPositive, Min } from 'class-validator';

export class GetBlogsDto {
  @Type(() => Number)
  @Min(0)
  readonly limit?: number;
}
