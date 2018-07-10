import { CacheService } from '@core/cache/cache.service';

describe('CacheService', () => {
  let service: CacheService;
  let cache: any;
  beforeEach(async () => {
    cache = {};
    service = new CacheService(cache);
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // Testing that callbacks are mapped to Promise correctly
  describe('get', () => {
    it('should return resolved promise', () => {
      cache.get = jest
        .fn()
        .mockImplementation((_, fn: (err: any, value: any) => void) => {
          fn(false, 'value');
        });
      expect(service.get('key')).resolves.toBe('value');
    });

    it('should return rejected promise', async () => {
      cache.get = jest
        .fn()
        .mockImplementation((_, fn: (err: any, value: any) => void) => {
          fn('error-message', false);
        });
      await expect(service.get('key')).rejects.toBe('error-message');
    });
  });

  describe('set', () => {
    it('should return resolved promise', async () => {
      cache.set = jest
        .fn()
        .mockImplementation(
          (
            _key: string,
            _value: any,
            _ttl: number,
            fn: (err: any, success: any) => void
          ) => {
            fn(false, true);
          }
        );
      await expect(service.set('key', 'value')).resolves.toBe(true);
    });

    it('should return rejected promise', async () => {
      cache.set = jest
        .fn()
        .mockImplementation(
          (_key, _value, _ttl, fn: (err: any, value: any) => void) => {
            fn('error-message', false);
          }
        );
      await expect(service.set('key', 'value')).rejects.toBe('error-message');
    });
  });

  describe('delete', () => {
    it('should return resolved promise', async () => {
      cache.del = jest.fn().mockImplementation((_key, callback) => {
        callback();
      });
      // tslint:disable-next-line:no-unused-expression
      await expect(service.delete('key')).resolves;
    });
  });
});
