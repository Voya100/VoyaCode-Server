import { CacheService } from '@core/cache/cache.service';
import { EmailService } from '@core/email/email.service';
import { MailgunMock } from '@core/email/mailgun.mock';
import { EncryptService } from '@core/encrypt/encrypt.service';
import {
  PushSubscriptionEntity,
  PushSubscriptionKeysEntity
} from '@core/push/entities';
import { ServerConfigService } from '@core/server-config/server-config.service';
import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import mailgunConstructor from 'mailgun-js';
import NodeCache from 'node-cache';
import WebPush from 'web-push';

import { PushSubscriptionTopicEntity } from './push/entities';
import { PushService } from './push/push.service';

const serverConfig = new ServerConfigService(
  process.env.NODE_ENV || 'development'
);
const encryptService = new EncryptService(serverConfig);

// Real emails should only be sent in production
const mailgun =
  serverConfig.env === 'production'
    ? mailgunConstructor(serverConfig.mailgun)
    : MailgunMock();

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([
      PushSubscriptionEntity,
      PushSubscriptionKeysEntity,
      PushSubscriptionTopicEntity
    ])
  ],
  providers: [
    {
      provide: ServerConfigService,
      useValue: serverConfig
    },
    {
      provide: CacheService,
      useValue: new CacheService(new NodeCache())
    },
    {
      provide: EncryptService,
      useValue: encryptService
    },
    {
      provide: EmailService,
      useValue: new EmailService(encryptService, mailgun as any)
    },
    {
      provide: 'WebPush',
      useValue: WebPush
      //provide: 'WebPush',
      //useValue: {} // WebPush
    },
    PushService
  ],
  exports: [
    ServerConfigService,
    CacheService,
    EmailService,
    EncryptService,
    PushService
  ]
})
export class CoreModule {}
