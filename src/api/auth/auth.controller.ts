import { LoginDto } from '@api/auth/auth.dtos';
import { AuthService } from '@api/auth/auth.service';
import { callback } from '@api/auth/jwt.strategy';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Request,
  UseGuards
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('api/auth')
export class AuthController {
  constructor(private auth: AuthService) {}

  @Post('login')
  @HttpCode(200)
  async login(@Body() { username, password }: LoginDto, @Request() req: any) {
    const token = await this.auth.login(username, password);
    // Resets failures for rate limiter
    req.brute.reset();
    return { token };
  }

  /**
   * Can be used to check whether user is currently logged in or not
   */
  @Get('check-login')
  @UseGuards(AuthGuard('jwt', { callback }))
  async checkLogin() {
    return { message: 'Logged in.' };
  }
}
