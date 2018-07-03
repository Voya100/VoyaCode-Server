import { Global, Module } from '@nestjs/common';
import { ServerConfigService } from './server-config/server-config.service';

@Global()
@Module({
  providers: [
    {
      provide: ServerConfigService,
      useValue: new ServerConfigService(process.env.NODE_ENV || 'development')
    }
  ],
  exports: [ServerConfigService]
})
export class CoreModule {}
