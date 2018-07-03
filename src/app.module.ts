import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoreModule } from './core/core.module';
import { ServerConfigService } from './core/server-config/server-config.service';

@Module({
  imports: [
    CoreModule,
    TypeOrmModule.forRoot(new ServerConfigService(
      process.env.NODE_ENV || 'development'
    ).database as any),
  ]
})
export class AppModule {}
