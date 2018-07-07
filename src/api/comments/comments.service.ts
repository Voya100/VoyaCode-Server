import { validateEntity } from '@common/helpers/database-helpers';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AddCommentDto } from './comments.dtos';
import { Comment } from './comments.entity';

@Injectable()
export class CommentsService {
  static readonly forbiddenUsernames = ['Voya', 'admin'];

  static isForbiddenName(name: string) {
    return CommentsService.forbiddenUsernames.includes(name);
  }

  constructor(
    @InjectRepository(Comment) private readonly comments: Repository<Comment>
  ) {}

  getComments(includePrivate = false): Promise<Comment[]> {
    if (includePrivate) {
      return this.comments.find({ isDeleted: false });
    } else {
      return this.comments.find({ isDeleted: false, isPrivate: false });
    }
  }

  async addComment(
    { username, message, isPrivate }: AddCommentDto,
    isAdmin = false
  ): Promise<Comment> {
    // Only the admin can use forbidden names
    if (CommentsService.isForbiddenName(username) && !isAdmin) {
      throw new BadRequestException('Username is forbidden, use another.');
    }
    const comment = this.comments.create({ username, message, isPrivate });
    await validateEntity(comment);
    return this.comments.save(comment);
  }

  async editComment({
    id,
    message,
    isPrivate
  }: {
    id: number;
    message: string;
    isPrivate: boolean;
  }): Promise<Comment> {
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
