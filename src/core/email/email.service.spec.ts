import { EmailService } from '@core/email/email.service';
import { Test, TestingModule } from '@nestjs/testing';

import { AppModule } from '../../app.module';

describe('EmailService', () => {
  let service: EmailService;
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule]
    }).compile();
    service = module.get<EmailService>(EmailService);
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
