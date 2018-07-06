import { BlogResult } from '@api/blogs/blogs.interfaces';
import { BlogsController } from './blogs.controller';
import { BlogsService } from './blogs.service';

describe('Blogs Controller', () => {
  let blogsService: BlogsService;
  let blogsController: BlogsController;
  beforeAll(async () => {
    blogsService = new BlogsService({} as any);
    blogsController = new BlogsController(blogsService);
  });

  const rawBlogs = [
    {
      id: 1,
      name: 'Blog1',
      text: 'Blog 1 [b]description[/b]',
      date: '2018-07-01T19:22:10.152Z'
    },
    {
      id: 2,
      name: 'Blog2',
      text: 'Blog 2 description',
      date: '2018-07-11T19:22:10.152Z'
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
  const formattedResponse = { status: 'success', data: formattedBlogs };

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
      const getBlogsSpy = jest.fn().mockReturnValue(rawBlogs[0]);
      blogsService.getBlogs = getBlogsSpy;
      expect(await blogsController.getBlogs({ limit: 1 })).toEqual({
        status: 'success',
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
