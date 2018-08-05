import { ApiModule } from '@api/api.module';
import { RateLimiterMiddleware } from '@common/middlewares/rate-limiter.middleware';
import { CoreModule } from '@core/core.module';
import { ServerConfigService } from '@core/server-config/server-config.service';
import { MiddlewareConsumer, Module } from '@nestjs/common';
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
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    // Start limiting if user does more than 250 requests in 1 hour
    consumer
      .apply(RateLimiterMiddleware)
      .with({
        retries: 250,
        lifetime: 60 * 60
      })
      .forRoutes('api/*');
  }
}
