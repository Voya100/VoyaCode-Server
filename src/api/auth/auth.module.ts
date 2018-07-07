import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { UsersService } from './users/users.service';

@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, UsersService]
})
export class AuthModule {}
