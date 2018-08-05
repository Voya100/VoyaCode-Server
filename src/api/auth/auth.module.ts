import { AuthController } from '@api/auth/auth.controller';
import { AuthService } from '@api/auth/auth.service';
import { JwtStrategy } from '@api/auth/jwt.strategy';
import { UsersService } from '@api/auth/users/users.service';
import { RateLimiterMiddleware } from '@common/middlewares/rate-limiter.middleware';
import { MiddlewareConsumer, Module } from '@nestjs/common';
import { Request, Response } from 'express';

@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, UsersService]
})
export class AuthModule {
  configure(consumer: MiddlewareConsumer) {
    // Start limiting if user does more than 250 requests in 1 hour
    consumer
      .apply(RateLimiterMiddleware)
      .with({
        retries: 5,
        lifetime: 60 * 60,
        minWait: 5 * 60 * 1000,
        keyCallback: (
          req: Request,
          _res: Response,
          next: (key: string) => {}
        ) => next(req.body && req.body.username)
      })
      .forRoutes('api/auth/login');
  }
}
