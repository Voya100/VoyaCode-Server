import { Test, TestingModule } from '@nestjs/testing';
import { BlogsController } from './blogs.controller';

describe('Blogs Controller', () => {
  let module: TestingModule;
  beforeAll(async () => {
    module = await Test.createTestingModule({
      controllers: [BlogsController],
    }).compile();
  });
  it('should be defined', () => {
    const controller: BlogsController = module.get<BlogsController>(BlogsController);
    expect(controller).toBeDefined();
  });
});
