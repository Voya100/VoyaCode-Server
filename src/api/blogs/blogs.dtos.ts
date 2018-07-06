import { Type } from 'class-transformer';
import { IsInt, IsPositive, IsString } from 'class-validator';

export class GetBlogsDto {
  @Type(() => Number)
  @IsPositive({
    message: 'Limit must be a positive number.'
  })
  @IsInt({
    message: 'Limit must be an integer.'
  })
  readonly limit?: number;
}

export class BlogIdParamDto {
  @Type(() => Number)
  readonly id: number;
}

export class AddBlogDto {
  @IsString() readonly name: string;
  @IsString() readonly text: string;
}

export class EditBlogDto extends AddBlogDto {}
