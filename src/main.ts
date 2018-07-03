import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as morgan from 'morgan';
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

  await app.listen(process.env.port || 8080);
}
bootstrap();
