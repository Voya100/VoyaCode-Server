import { AnyExceptionFilter } from '@common/exception-filters/any-exception.filter';
import { BadRequestExceptionFilter } from '@common/exception-filters/bad-request-exception.filter';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';

export async function generateApp() {
  const moduleFixture = await Test.createTestingModule({
    imports: [AppModule]
  }).compile();
  const app = moduleFixture.createNestApplication();
  applyGlobalsToApp(app);
  return app;
}

export function applyGlobalsToApp(app: INestApplication) {
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
  app.useGlobalFilters(
    new AnyExceptionFilter(),
    new BadRequestExceptionFilter()
  );
}
