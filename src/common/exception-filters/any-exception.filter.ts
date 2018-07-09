import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';

/**
 * Catches errors that haven't been caught by others
 */
@Catch()
export class AnyExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const status = exception.status || 500;

    if (process.env.NODE_ENV !== 'production') {
      console.error(exception);
    }

    response.status(status).json({
      statusCode: status,
      error: 'Server error',
      message: exception.message || 'Server error'
    });
  }
}
