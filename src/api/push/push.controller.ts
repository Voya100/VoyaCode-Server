import { PushService } from '@core/push/push.service';
import { Controller, Get, Query } from '@nestjs/common';

/**
 * Note: Push notification registration logic is located near relevant topic.
 * As an example, blos subscription paths are in BlogSubscriptionController
 */

@Controller('api/push')
export class PushController {
  constructor(private pushService: PushService) {}

  // Post used because subscription endpoint could be considered as sensitive information
  @Get('subscription-topics')
  async getSubscriptionTopic(@Query() { endpoint }: { endpoint: string }) {
    return { topics: await this.pushService.getSubscribedTopics(endpoint) };
  }
}
