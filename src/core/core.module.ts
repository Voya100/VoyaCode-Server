import { CacheService } from '@core/cache.service';
import { EmailService } from '@core/email/email.service';
import { EncryptService } from '@core/encrypt/encrypt.service';
import { ServerConfigService } from '@core/server-config/server-config.service';
import { Global, Module } from '@nestjs/common';
import mailgunConstructor from 'mailgun-js';
import NodeCache from 'node-cache';

import { MailgunMock } from './email/mailgun.mock';

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
    }
  ],
  exports: [ServerConfigService, CacheService, EmailService, EncryptService]
})
export class CoreModule {}
