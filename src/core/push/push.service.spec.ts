import {
  PushSubscriptionEntity,
  PushSubscriptionTopicEntity
} from '@core/push/entities';
import { PushService } from '@core/push/push.service';
import { ServerConfigService } from '@core/server-config/server-config.service';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('PushService', () => {
  let service: PushService;
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PushService,
        {
          provide: 'web-push',
          useValue: {
            setVapidDetails: () => {}
          }
        },
        {
          provide: getRepositoryToken(PushSubscriptionEntity),
          useValue: {}
        },
        {
          provide: getRepositoryToken(PushSubscriptionTopicEntity),
          useValue: {}
        },
        {
          provide: ServerConfigService,
          useValue: new ServerConfigService('test')
        }
      ]
    }).compile();
    service = module.get<PushService>(PushService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
