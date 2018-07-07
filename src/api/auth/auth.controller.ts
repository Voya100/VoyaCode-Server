import { LoginDto } from '@api/auth/auth.dtos';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  UseGuards
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { callback } from './jwt.strategy';

@Controller('api/auth')
export class AuthController {
  constructor(private auth: AuthService) {}

  @Post('login')
  @HttpCode(200)
  async login(@Body() { username, password }: LoginDto) {
    const token = await this.auth.login(username, password);
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
