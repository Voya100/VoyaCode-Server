import { BlogsController } from '@api/blogs/blogs.controller';
import { BlogResult } from '@api/blogs/blogs.interfaces';
import { BlogsService } from '@api/blogs/blogs.service';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { AppModule } from '../../app.module';

import { BlogEntity } from './blog.entity';

describe('Blogs Controller', () => {
  let module: TestingModule;
  let blogsService: BlogsService;
  let blogsController: BlogsController;
  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [AppModule]
    })
      .overrideProvider(getRepositoryToken(BlogEntity))
      .useValue({})
      .compile();
    blogsService = module.get(BlogsService);
    blogsController = module.get(BlogsController);
  });

  const rawBlogs = [
    {
      id: 1,
      name: 'Blog1',
      text: 'Blog 1 [b]description[/b]',
      date: new Date('2018-07-01T19:22:10.152Z')
    },
    {
      id: 2,
      name: 'Blog2',
      text: 'Blog 2 description',
      date: new Date('2018-07-11T19:22:10.152Z')
    }
  ];
  const formattedBlogs: BlogResult[] = [
    {
      id: 1,
      name: 'Blog1',
      text: 'Blog 1 <b>description</b>',
      date: '01.07.2018',
      year: 2018
    },
    {
      id: 2,
      name: 'Blog2',
      text: 'Blog 2 description',
      date: '11.07.2018',
      year: 2018
    }
  ];
  const formattedResponse = { data: formattedBlogs };

  it('should be defined', () => {
    expect(blogsController).toBeDefined();
  });

  describe('/GET blogs', () => {
    it('should return array of formatted blogs', async () => {
      const getBlogsSpy = jest.fn().mockReturnValue(rawBlogs);
      blogsService.getBlogs = getBlogsSpy;
      expect(await blogsController.getBlogs({})).toEqual(formattedResponse);
      expect(getBlogsSpy).toHaveBeenCalledWith({});
    });
    it('should return a single blog when using limit', async () => {
      const getBlogsSpy = jest.fn().mockReturnValue([rawBlogs[0]]);
      blogsService.getBlogs = getBlogsSpy;
      expect(await blogsController.getBlogs({ limit: 1 })).toEqual({
        data: [formattedBlogs[0]]
      });
      expect(getBlogsSpy).toHaveBeenCalledWith({ limit: 1 });
    });
  });

  describe('/GET blogs/:id', () => {});

  describe('/POST blogs', () => {});

  describe('/PUT blogs', () => {});

  describe('/DELETE blogs', () => {});
});
