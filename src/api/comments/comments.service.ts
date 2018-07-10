import { AddCommentDto } from '@api/comments/comments.dtos';
import { CommentEntity } from '@api/comments/comments.entity';
import { validateEntity } from '@common/helpers/database-helpers';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class CommentsService {
  static readonly forbiddenUsernames = ['Voya', 'admin'];

  static isForbiddenName(name: string) {
    return CommentsService.forbiddenUsernames.includes(name);
  }

  constructor(
    @InjectRepository(CommentEntity)
    private readonly comments: Repository<CommentEntity>
  ) {}

  getComments(includePrivate = false): Promise<CommentEntity[]> {
    const isPrivate = includePrivate ? {} : { isPrivate: false };
    return this.comments.find({
      where: { isDeleted: false, ...isPrivate },
      order: {
        id: 'DESC'
      }
    });
  }

  async addComment(
    commentDetails: AddCommentDto,
    isAdmin = false
  ): Promise<CommentEntity> {
    const comment = await this.createComment(commentDetails, isAdmin);
    return this.comments.save(comment);
  }

  // Creates a comment entity without saving it
  // Also handles validation
  async createComment(
    { username, message, isPrivate }: AddCommentDto,
    isAdmin = false
  ) {
    // Only the admin can use forbidden names
    if (CommentsService.isForbiddenName(username) && !isAdmin) {
      throw new BadRequestException('Username is forbidden, use another.');
    }
    const comment = this.comments.create({ username, message, isPrivate });
    await validateEntity(comment);
    return comment;
  }

  async editComment({
    id,
    message,
    isPrivate
  }: {
    id: number;
    message: string;
    isPrivate: boolean;
  }): Promise<CommentEntity> {
    const comment = await this.comments.findOneOrFail(id);
    comment.message = message;
    if (isPrivate !== undefined) {
      comment.isPrivate = isPrivate;
    }
    await validateEntity(comment);
    return this.comments.save(comment);
  }

  async deleteComment(id: number) {
    const comment = await this.comments.findOneOrFail(id);
    return this.comments.remove(comment);
  }
}
