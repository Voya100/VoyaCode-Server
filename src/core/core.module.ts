import { Global, Module } from '@nestjs/common';
import NodeCache from 'node-cache';
import { CacheService } from './cache.service';
import { ServerConfigService } from './server-config/server-config.service';

@Global()
@Module({
  providers: [
    {
      provide: ServerConfigService,
      useValue: new ServerConfigService(process.env.NODE_ENV || 'development')
    },
    {
      provide: CacheService,
      useValue: new CacheService(new NodeCache())
    }
  ],
  exports: [ServerConfigService, CacheService]
})
export class CoreModule {}
