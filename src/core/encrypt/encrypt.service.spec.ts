import { EncryptService } from '@core/encrypt/encrypt.service';
import { Test, TestingModule } from '@nestjs/testing';

import { AppModule } from '../../app.module';

describe('EncryptService', () => {
  let service: EncryptService;
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule]
    }).compile();
    service = module.get<EncryptService>(EncryptService);
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
