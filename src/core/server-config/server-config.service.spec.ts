import { Test, TestingModule } from '@nestjs/testing';
import { config as devConfig } from './config.development';
import { ServerConfigService } from './server-config.service';

describe('ServerConfigService', () => {
  let service: ServerConfigService;
  beforeAll(async () => {
    service = new ServerConfigService('development');
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  it('should include environment specific configs', () => {
    expect(service).toMatchObject(devConfig);
  });
});
