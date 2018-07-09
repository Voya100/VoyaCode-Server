import { ApiModule } from '@api/api.module';
import { CoreModule } from '@core/core.module';
import { ServerConfigService } from '@core/server-config/server-config.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    CoreModule,
    TypeOrmModule.forRoot(new ServerConfigService(
      process.env.NODE_ENV || 'development'
    ).database as any),
    ApiModule
  ]
})
export class AppModule {}
