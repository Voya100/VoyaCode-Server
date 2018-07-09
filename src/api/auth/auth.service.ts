import { JwtPayload } from '@api/auth/jwt-payload.interface';
import { IUser } from '@api/auth/users/user.interface';
import { UsersService } from '@api/auth/users/users.service';
import { ServerConfigService } from '@core/server-config/server-config.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly config: ServerConfigService
  ) {}

  /**
   * Checks that username and password match and returns a Json web token
   */
  async login(username: string, password: string) {
    // Note: Because there is only 1 user (the admin) and the password
    // is unique, the password doesn't need to be encrypted
    // Todo: add encryption anyway?
    const realPassword = await this.usersService.getUserPassword(username);
    if (realPassword === password) {
      const user = await this.usersService.getUser(username);
      return this.createToken(user.username, user.role);
    }
    throw new UnauthorizedException(
      'Login failed: wrong username or password.'
    );
  }

  async createToken(username: string, role: string) {
    const user: JwtPayload = { username, role };
    return jwt.sign(user, this.config.jwt.tokenSecret, {
      expiresIn: this.config.jwt.expiryTime
    });
  }

  async validateUser(payload: JwtPayload): Promise<IUser> {
    return await this.usersService.getUser(payload.username);
  }
}
