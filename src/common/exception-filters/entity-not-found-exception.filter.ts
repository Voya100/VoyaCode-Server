import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { EntityNotFoundError } from 'typeorm/error/EntityNotFoundError';

/**
 * Catches EntityNotFound errors and return 404 message
 */
@Catch()
export class EntityNotFoundFilter implements ExceptionFilter {
  constructor(private message: string) {}
  catch(_exception: EntityNotFoundError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    response.status(404).json({
      statusCode: 404,
      error: 'Not Found',
      message: this.message
    });
  }
}
