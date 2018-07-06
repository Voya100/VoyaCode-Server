import { Repository } from 'typeorm';
import { Blog } from './blog.entity';
import { BlogsService } from './blogs.service';

describe('BlogsService', () => {
  let service: BlogsService;
  let mockRepository: Repository<Blog>;

  beforeAll(async () => {
    mockRepository = {} as any;
    service = new BlogsService(mockRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
