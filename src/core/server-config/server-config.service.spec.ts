import { config as devConfig } from '@core/server-config/config.development';
import { ServerConfigService } from '@core/server-config/server-config.service';

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
