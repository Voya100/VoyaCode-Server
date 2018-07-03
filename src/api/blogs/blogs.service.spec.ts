import { Test, TestingModule } from '@nestjs/testing';
import { BlogsService } from './blogs.service';

describe('BlogsService', () => {
  let service: BlogsService;
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BlogsService],
    }).compile();
    service = module.get<BlogsService>(BlogsService);
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
