import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter
} from '@nestjs/common';
import { ValidationError } from 'class-validator';

// Transforms ValidationPipe's error messages into simpler format
@Catch(BadRequestException)
export class BadRequestExceptionFilter implements ExceptionFilter {
  catch(exception: BadRequestException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    let message;
    const errorMessage = exception.message.message;
    if (errorMessage && errorMessage[0] instanceof ValidationError) {
      message = [];
      // Get all constraint description messages and put into array
      errorMessage.forEach(property => {
        Object.keys(property.constraints).forEach(key => {
          message.push(property.constraints[key]);
        });
      });
    } else {
      message = errorMessage;
    }

    response.status(exception.getStatus()).json({
      statusCode: exception.getStatus(),
      error: 'Bad Request',
      message
    });
  }
}
