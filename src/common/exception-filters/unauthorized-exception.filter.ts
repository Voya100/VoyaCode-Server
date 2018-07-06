import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  UnauthorizedException
} from '@nestjs/common';

@Catch(UnauthorizedException)
export class UnauthorizedExceptionFilter implements ExceptionFilter {
  constructor(private message?: string) {}
  catch(_exception: UnauthorizedException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    response.status(401).json({
      statusCode: 401,
      error: 'Unauthorized',
      message: this.message || 'You need to be logged in to proceed.'
    });
  }
}
