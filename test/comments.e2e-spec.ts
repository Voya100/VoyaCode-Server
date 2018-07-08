import { CommentsController } from '@api/comments/comments.controller';
import { AddCommentDto } from '@api/comments/comments.dtos';
import { CommentEntity } from '@api/comments/comments.entity';
import { CommentResult } from '@api/comments/comments.interfaces';
import { CommentsService } from '@api/comments/comments.service';
import { INestApplication } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import request from 'supertest';
import { Response } from 'supertest';
import { Repository } from 'typeorm';
import { generateApp, getAuthHeader } from './helpers/test.utils';

describe('CommentsController (e2e)', () => {
  let app: INestApplication;
  let commentRepository: Repository<CommentEntity>;
  let authHeader: string;

  beforeAll(async () => {
    app = await generateApp();
    commentRepository = app.get(getRepositoryToken(CommentEntity));
    authHeader = await getAuthHeader(app, 'Admin', 'admin');
    await app.init();
  });

  afterEach(async () => {
    await commentRepository.clear();
  });

  const privateComment = {
    username: '<i>Private user</i>',
    message: 'My secret message to you <3',
    isPrivate: true
  };
  const formattedPrivateComment = {
    username: '&lt;i&gt;Private user&lt;/i&gt;',
    message: 'My secret message to you &lt;3',
    isPrivate: true
  };
  const rawComments: AddCommentDto[] = [
    {
      username: 'Tester',
      message: 'Comment 1 [b]description[/b]',
      isPrivate: false
    },
    {
      username: 'Tester2',
      message: "Comment<script>alert('hax')</script> 2 [b]description[/b]",
      isPrivate: false
    },
    {
      username: '<b>Tester3</b>',
      message: 'Comment 3 [url=/hey]My link[/url]',
      isPrivate: false
    },
    privateComment
  ];
  const formattedComments: AddCommentDto[] = [
    {
      username: 'Tester',
      message: 'Comment 1 <b>description</b>',
      isPrivate: false
    },
    {
      username: 'Tester2',
      message:
        'Comment&lt;script&gt;alert(&#39;hax&#39;)&lt;/script&gt; 2 <b>description</b>',
      isPrivate: false
    },
    {
      username: '&lt;b&gt;Tester3&lt;/b&gt;',
      message: 'Comment 3 <a href="/hey">My link</a>',
      isPrivate: false
    },
    formattedPrivateComment
  ];

  describe('GET /api/comments', () => {
    it('should return empty array of comments', () => {
      return request(app.getHttpServer())
        .get('/api/comments')
        .expect(200)
        .expect({ data: [] });
    });

    it('should return formatted comments that are not private', async () => {
      await commentRepository.insert(rawComments);
      const comments = formattedComments.filter(c => !c.isPrivate);
      return request(app.getHttpServer())
        .get('/api/comments')
        .expect(200)
        .expect((res: Response) => {
          expect(res.body.data).toMatchObject(comments);
        });
    });

    it('should include private comments if user is authenticated', async () => {
      await commentRepository.insert(rawComments);
      return request(app.getHttpServer())
        .get('/api/comments')
        .set('Authorization', authHeader)
        .expect(200)
        .expect((res: Response) => {
          expect(res.body.data).toMatchObject(formattedComments);
        });
    });
  });

  describe('POST /api/comments', () => {
    it('should post a comment', async () => {
      const { username, message } = rawComments[0];
      const formattedComment = formattedComments[0];
      let id: number;
      await request(app.getHttpServer())
        .post('/api/comments')
        .send({ username, message })
        .expect(201)
        .expect((response: Response) => {
          const data: CommentResult = response.body.data;
          id = data.id;
          expect(data.username).toBe(formattedComment.username);
          expect(data.message).toBe(formattedComment.message);
          expect(data.id).toBeDefined();
          expect(data.postTime).toBeDefined();
          expect(data.updateTime).toBeDefined();
          expect(data.postTime).toBe(data.updateTime);
          expect(response.body.message).toBe('Comment added successfully.');
        });
      await commentRepository.findOneOrFail(id);
    });

    it('should not post a comment with forbidden username', async () => {
      const { message } = rawComments[0];
      const forbiddenName = CommentsService.forbiddenUsernames[0];
      await request(app.getHttpServer())
        .post('/api/comments')
        .send({ username: forbiddenName, message })
        .expect(400)
        .expect({
          statusCode: 400,
          error: 'Bad Request',
          message: 'Username is forbidden, use another.'
        });
    });

    it('should allow forbidden username with admin credentials', async () => {
      const { message } = rawComments[0];
      const forbiddenName = CommentsService.forbiddenUsernames[0];
      await request(app.getHttpServer())
        .post('/api/comments')
        .set('Authorization', authHeader)
        .send({ username: forbiddenName, message })
        .expect(201);
    });
  });

  describe('PUT /api/comments/:id', async () => {
    it('should edit the comment', async () => {
      await commentRepository.insert(rawComments);
      const comment = await commentRepository.findOne();
      const updatedMessage = '[b]new-message[/b]';
      const formattedComment = CommentsController.formatCommentResult({
        ...comment,
        message: updatedMessage
      });
      await request(app.getHttpServer())
        .put('/api/comments/' + comment.id)
        .set('Authorization', authHeader)
        .send({ message: updatedMessage })
        .expect(200)
        .expect((req: Response) => {
          const data: CommentResult = req.body.data;
          expect(data.id).toBe(comment.id);
          expect(data.postTime).toBe(formattedComment.postTime);
          expect(data.message).toBe(formattedComment.message);
          expect(req.body.message).toBe('Comment edited successfully.');
        });
    });

    it('should return 401 when not authenticated', async () => {
      await commentRepository.insert(rawComments);
      const comment = await commentRepository.findOne();
      await request(app.getHttpServer())
        .put('/api/comments/' + comment.id)
        .send({ message: 'test' })
        .expect(401);
    });

    it('should return 404 when id does not exist', () => {
      return request(app.getHttpServer())
        .put('/api/comments/1')
        .set('Authorization', authHeader)
        .send({ text: 'text', name: 'name' })
        .expect(404)
        .expect({
          statusCode: 404,
          error: 'Not Found',
          message: 'Comment does not exist.'
        });
    });
  });

  describe('DELETE /api/comments/:id', async () => {
    it('should mark comment as deleted', async () => {
      await commentRepository.insert(rawComments);
      const comment = await commentRepository.findOne();
      await request(app.getHttpServer())
        .delete('/api/comments/' + comment.id)
        .set('Authorization', authHeader)
        .expect(200)
        .expect({
          message: 'Comment deleted successfully.'
        });
      expect(await commentRepository.findOne(comment.id)).toBeUndefined();
    });

    it('should not delete if user is unauthenticated', async () => {
      await commentRepository.insert(rawComments);
      const comment = await commentRepository.findOne();
      await request(app.getHttpServer())
        .delete('/api/comments/' + comment.id)
        .expect(401);
    });

    it('should return 404 when id does not exist', () => {
      return request(app.getHttpServer())
        .delete('/api/comments/1')
        .set('Authorization', authHeader)
        .expect(404)
        .expect({
          statusCode: 404,
          error: 'Not Found',
          message: 'Comment does not exist.'
        });
    });
  });
});
