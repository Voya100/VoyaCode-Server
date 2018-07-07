import { IUser } from '@api/auth/users/user.interface';
import { ServerConfigService } from '@core/server-config/server-config.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from './auth.service';
import { JwtPayload } from './jwt-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly authService: AuthService,
    private readonly config: ServerConfigService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.jwt.tokenSecret
    });
  }

  async validate(payload: JwtPayload, done: (err: any, user: any) => void) {
    const user = await this.authService.validateUser(payload);
    if (!user) {
      return done(new UnauthorizedException(), false);
    }
    done(null, user);
  }
}

export const callback = (err: Error, user: IUser, jwtError: any) => {
  let message;
  if (jwtError instanceof TokenExpiredError) {
    message = 'Session has expired.';
  } else if (
    jwtError instanceof JsonWebTokenError ||
    (jwtError && jwtError.message === 'No auth token')
  ) {
    message = 'A valid authentication token is required.';
  }
  if (message) {
    throw new UnauthorizedException(message);
  } else if (err) {
    throw err;
  }
  return user;
};

/**
 * Skips the error process. If login fails, returned user is undefined.
 */
export const optionalLogin = (_err: Error, user: IUser) => {
  return user;
};
