import { BlogEntity } from '@api/blogs/blog.entity';
import { BlogsService } from '@api/blogs/blogs.service';
import { Repository } from 'typeorm';

describe('BlogsService', () => {
  let service: BlogsService;
  let mockRepository: Repository<BlogEntity>;

  beforeAll(async () => {
    mockRepository = {} as any;
    service = new BlogsService(mockRepository, {} as any);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
