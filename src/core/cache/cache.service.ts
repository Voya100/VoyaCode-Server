import { Injectable } from '@nestjs/common';
import NodeCache from 'node-cache';

@Injectable()
export class CacheService {
  constructor(private cache: NodeCache) {}

  get(key: string) {
    return new Promise((resolve, reject) => {
      this.cache.get(key, (err, value) => {
        if (err) {
          return reject(err);
        }
        resolve(value);
      });
    });
  }

  set(key: string, value: any, ttl = 10 * 60) {
    return new Promise((resolve, reject) => {
      this.cache.set(key, value, ttl, (err, success) => {
        if (err) {
          return reject(err);
        }
        resolve(success);
      });
    });
  }

  delete(key: string) {
    return new Promise(resolve => {
      this.cache.del(key, () => resolve());
    });
  }
}
