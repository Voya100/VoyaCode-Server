import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import morgan from 'morgan';
import { join } from 'path';
import { AppModule } from './app.module';
import { BadRequestExceptionFilter } from './common/exception-filters/bad-request-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { logger: console });

  app.use(morgan('dev'));

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      skipMissingProperties: true,
      validationError: {
        target: false,
        value: false
      }
    })
  );
  app.useStaticAssets(join(__dirname, '../../public'));
  app.useGlobalFilters(new BadRequestExceptionFilter());

  await app.listen(process.env.port || 8080);
}
bootstrap();
