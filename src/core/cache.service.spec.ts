import { CoreModule } from '@core/core.module';
import { Test, TestingModule } from '@nestjs/testing';
import { CacheService } from './cache.service';

describe('CacheService', () => {
  let service: CacheService;
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CoreModule]
    }).compile();
    service = module.get<CacheService>(CacheService);
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
