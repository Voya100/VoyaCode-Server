import { PushService } from '@core/push/push.service';
import { Test, TestingModule } from '@nestjs/testing';

import { PushController } from './push.controller';

describe('Push Controller', () => {
  let module: TestingModule;
  beforeAll(async () => {
    module = await Test.createTestingModule({
      providers: [
        {
          provide: PushService,
          useValue: {}
        }
      ],
      controllers: [PushController]
    }).compile();
  });
  it('should be defined', () => {
    const controller: PushController = module.get<PushController>(
      PushController
    );
    expect(controller).toBeDefined();
  });
});
