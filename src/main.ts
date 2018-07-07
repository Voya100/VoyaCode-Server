import { AnyExceptionFilter } from '@common/exception-filters/any-exception.filter';
import { BadRequestExceptionFilter } from '@common/exception-filters/bad-request-exception.filter';
import { UnauthorizedExceptionFilter } from '@common/exception-filters/unauthorized-exception.filter';
import { ServerConfigService } from '@core/server-config/server-config.service';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';
import morgan from 'morgan';
import { join } from 'path';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { logger: console });
  const config = app.get(ServerConfigService);
  app.use(
    helmet({
      frameguard: false
    })
  );
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
    new AnyExceptionFilter(),
    new BadRequestExceptionFilter(),
    new UnauthorizedExceptionFilter()
  );

  await app.listen(process.env.port || config.port || 8080);
}
bootstrap();
