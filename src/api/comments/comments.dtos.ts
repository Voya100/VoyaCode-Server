import { Type } from 'class-transformer';

export class CommentIdParamDto {
  @Type(() => Number)
  readonly id: number;
}

export class AddCommentDto {
  username: string;
  message: string;
  isPrivate: boolean;
}

export class EditCommentDto {
  message: string;
  isPrivate?: boolean;
}
