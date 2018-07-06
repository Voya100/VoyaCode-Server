import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { UsersService } from './users.service';

@Module({
  providers: [AuthService, JwtStrategy, UsersService]
})
export class AuthModule {}
