import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  NotFoundException
} from '@nestjs/common';
import { Request } from 'express-serve-static-core';

/**
 * Catches and handles 404 errors
 */
@Catch(NotFoundException)
export class NotFoundExceptionFilter implements ExceptionFilter {
  catch(_exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request: Request = ctx.getRequest();
    const response = ctx.getResponse();
    const status = 404;
    const isApiCall = request.url.includes('/api/');
    if (isApiCall) {
      // JSON response for /api/ paths
      response.status(status).json({
        statusCode: status,
        error: 'Not Found',
        message: "Resource doesn't exist."
      });
    } else {
      // Otherwise redirect to frontend which may have the requested page
      response.sendFile('public/index.html', { root: '../' });
    }
  }
}
