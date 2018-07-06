import { User } from '@api/auth/user.interface';
import { ServerConfigService } from '@core/server-config/server-config.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { JwtPayload } from './jwt-payload.interface';
import { UsersService } from './users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly config: ServerConfigService
  ) {}

  async login(username: string, password: string) {
    // Note: Because there is only 1 user (the admin) and the password
    // is unique, the password doesn't need to be encrypted
    // Todo: add encryption anyway?
    const realPassword = await this.usersService.getUserPassword(username);
    if (realPassword === password) {
      const user = await this.usersService.getUser(username);
      return this.createToken(user.username, user.role);
    }
    throw new UnauthorizedException('Login failed: wrong username or password');
  }

  async createToken(username: string, role: string) {
    const user: JwtPayload = { username, role };
    return jwt.sign(user, this.config.jwt.tokenSecret, {
      expiresIn: this.config.jwt.expiryTime
    });
  }

  async validateUser(payload: JwtPayload): Promise<User> {
    return await this.usersService.getUser(payload.username);
  }
}
