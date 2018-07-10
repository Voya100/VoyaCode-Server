import { callback, optionalLogin } from '@api/auth/jwt.strategy';
import { IUser } from '@api/auth/users/user.interface';
import {
  AddCommentDto,
  CommentIdParamDto,
  EditCommentDto
} from '@api/comments/comments.dtos';
import { CommentEntity } from '@api/comments/comments.entity';
import { CommentResult } from '@api/comments/comments.interfaces';
import { CommentsService } from '@api/comments/comments.service';
import { User } from '@common/decorators/user.decorator';
import { EntityNotFoundFilter } from '@common/exception-filters/entity-not-found-exception.filter';
import { DataFormatter } from '@common/helpers/data-formatter';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  UseFilters,
  UseGuards
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('api/comments')
export class CommentsController {
  constructor(private commentsService: CommentsService) {}

  static formatCommentResult(comment: CommentEntity): CommentResult {
    const { id, username, message, postTime, updateTime, isPrivate } = comment;
    return {
      id,
      username: DataFormatter.escapeHtml(username),
      message: DataFormatter.tagsToHtml(DataFormatter.escapeHtml(message)),
      postTime: DataFormatter.formatDateTime(postTime),
      updateTime: DataFormatter.formatDateTime(updateTime),
      isPrivate
    };
  }

  @Get()
  @UseGuards(AuthGuard('jwt', { callback: optionalLogin }))
  async getComments(@User() user: IUser): Promise<{ data: CommentResult[] }> {
    // private comments should be shown only for the admin
    const includePrivate = user !== undefined && user.role === 'admin';
    const commentEntities = await this.commentsService.getComments(
      includePrivate
    );
    const commentResults = commentEntities.map(
      CommentsController.formatCommentResult
    );
    return { data: commentResults };
  }

  @Post()
  @UseGuards(AuthGuard('jwt', { callback: optionalLogin }))
  async addComment(
    @User() user: IUser,
    @Body() { username, message, isPrivate }: AddCommentDto
  ) {
    const isAdmin = user && user.role === 'admin';
    const commentEntity = await this.commentsService.addComment(
      { username, message, isPrivate },
      isAdmin
    );
    const commentResult = CommentsController.formatCommentResult(commentEntity);
    return {
      data: commentResult,
      message: 'Comment added successfully.'
    };
  }

  // Shows what comment would look like without posting it
  @Post('preview')
  @HttpCode(200)
  @UseGuards(AuthGuard('jwt', { callback: optionalLogin }))
  async previewComment(
    @User() user: IUser,
    @Body() { username, message, isPrivate }: AddCommentDto
  ) {
    const isAdmin = user && user.role === 'admin';
    const commentEntity = await this.commentsService.createComment(
      { username, message, isPrivate },
      isAdmin
    );
    const commentResult = CommentsController.formatCommentResult(commentEntity);
    return {
      data: commentResult
    };
  }

  @Put(':id')
  @UseFilters(new EntityNotFoundFilter('Comment does not exist.'))
  @UseGuards(AuthGuard('jwt', { callback }))
  async editComment(
    @Param() { id }: CommentIdParamDto,
    @Body() { message, isPrivate }: EditCommentDto
  ) {
    const commentEntity = await this.commentsService.editComment({
      id,
      message,
      isPrivate
    });
    const commentResult = CommentsController.formatCommentResult(commentEntity);
    return {
      data: commentResult,
      message: 'Comment edited successfully.'
    };
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt', { callback }))
  @UseFilters(new EntityNotFoundFilter('Comment does not exist.'))
  async deleteComment(@Param() { id }: CommentIdParamDto) {
    await this.commentsService.deleteComment(id);
    return {
      message: 'Comment deleted successfully.'
    };
  }
}
