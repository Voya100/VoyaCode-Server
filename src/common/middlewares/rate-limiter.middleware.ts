import {
  Inject,
  Injectable,
  MiddlewareFunction,
  NestMiddleware
} from '@nestjs/common';
import ExpressBrute from 'express-brute';

import { Request, Response } from 'express';

/**
 * Limits the number of requests users can send.
 * If users send more than x requests within specific time from same ip,
 * they will need to wait time y before they can request again.
 * Time y will increase the more requests the user sends.
 */
@Injectable()
export class RateLimiterMiddleware implements NestMiddleware {
  constructor(
    @Inject('ExpressBrute.MemoryStore') private store: ExpressBrute.MemoryStore
  ) {}

  private static sendTooManyRequestsResponse(
    _req: Request,
    res: Response,
    _next: () => {},
    nextValidRequestDate: Date
  ) {
    const secondsUntilNextRequest = Math.ceil(
      (nextValidRequestDate.getTime() - Date.now()) / 1000
    );
    res.header('Retry-After', secondsUntilNextRequest.toString());
    res.status(429);
    res.send({
      statusCode: 429,
      message:
        'Too many requests in this time frame. Try again after ' +
        RateLimiterMiddleware.getWaitTimeAsString(secondsUntilNextRequest) +
        '.',
      nextValidRequestDate
    });
  }

  private static getWaitTimeAsString(seconds: number) {
    if (seconds < 180) {
      return `${seconds} seconds`;
    } else if (seconds < 60 * 60) {
      return `${Math.ceil(seconds / 60)} minutes`;
    } else {
      return `${seconds / 3600} hours`;
    }
  }

  resolve({
    retries,
    minWait = 500,
    lifetime = 12 * 60 * 60,
    keyCallback
  }: {
    retries: number;
    minWait?: number;
    lifetime?: number;
    keyCallback?: MiddlewareFunction;
  }): MiddlewareFunction {
    return new ExpressBrute(this.store, {
      freeRetries: retries,
      minWait,
      lifetime,
      failCallback: RateLimiterMiddleware.sendTooManyRequestsResponse
    }).getMiddleware({
      key: keyCallback
    });
  }
}
