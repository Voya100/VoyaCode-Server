import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../app.module';
import { AuthController } from './auth.controller';

describe('Auth Controller', () => {
  let module: TestingModule;
  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [AppModule]
    }).compile();
  });
  it('should be defined', () => {
    const controller: AuthController = module.get<AuthController>(
      AuthController
    );
    expect(controller).toBeDefined();
  });
});
