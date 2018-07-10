import { Type } from 'class-transformer';
import {
  IsDateString,
  IsDefined,
  IsInt,
  IsNumber,
  IsPositive,
  IsString,
  MinLength
} from 'class-validator';

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
  @IsNumber()
  @Type(() => Number)
  readonly id: number;
}

export class AddBlogDto {
  @IsDefined()
  @MinLength(4, {
    message: 'Name must be longer than $constraint1 chatacters.'
  })
  @IsString()
  readonly name: string;

  @IsDefined()
  @MinLength(1, {
    message: 'Blog content must be longer than $constraint1 characters.'
  })
  @IsString()
  readonly text: string;
}

export class EditBlogDto extends AddBlogDto {}

export class PreviewBlogDto extends AddBlogDto {
  @IsNumber()
  @Type(() => Number)
  readonly id?: number;

  @IsDateString()
  @Type(() => Date)
  readonly date?: Date;
}
