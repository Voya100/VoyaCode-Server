import { AnyExceptionFilter } from '@common/exception-filters/any-exception.filter';
import { BadRequestExceptionFilter } from '@common/exception-filters/bad-request-exception.filter';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import morgan from 'morgan';
import { join } from 'path';
import { AppModule } from './app.module';

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
  app.useGlobalFilters(
    new BadRequestExceptionFilter(),
    new AnyExceptionFilter()
  );

  await app.listen(process.env.port || 8080);
}
bootstrap();
