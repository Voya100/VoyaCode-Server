import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  UnauthorizedException
} from '@nestjs/common';

@Catch(UnauthorizedException)
export class UnauthorizedExceptionFilter implements ExceptionFilter {
  constructor(private message?: string) {}
  catch(exception: UnauthorizedException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    while (exception.message.message) {
      exception = exception.message;
    }
    response.status(401).json({
      statusCode: 401,
      error: 'Unauthorized',
      message: this.message || exception.message
    });
  }
}
