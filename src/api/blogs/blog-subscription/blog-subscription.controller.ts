import { BlogSubscriptionService } from '@api/blogs/blog-subscription/blog-subscription.service';
import { PushSubscriptionDto } from '@core/push/push-subscription.dto';
import { PushService } from '@core/push/push.service';
import { Body, Controller, HttpCode, Param, Post } from '@nestjs/common';

import {
  EncryptedEmailDto,
  SendSubscribeConfirmationDto
} from '@api/blogs/blog-subscription/blog-subscription.dtos';

@Controller('api/blogs')
export class BlogSubscriptionController {
  constructor(
    private blogSubscription: BlogSubscriptionService,
    private pushService: PushService
  ) {}

  @Post('subscribe')
  @HttpCode(200)
  async sendSubscribeConfirmation(@Body()
  {
    email
  }: SendSubscribeConfirmationDto) {
    await this.blogSubscription.sendSubscribeConfirmation(email);
    return {
      message:
        'Confirmation link has been sent to your email address. Use the link to confirm your subscription.'
    };
  }

  @Post('subscribe/:email')
  @HttpCode(200)
  async subscribeToNewsletter(@Param() { email }: EncryptedEmailDto) {
    const unencryptedEmail = await this.blogSubscription.subscribeToNewsletter(
      email
    );
    return {
      message:
        `Your subscription to email ${unencryptedEmail} has been confirmed. ` +
        'If you ever need to unsubscribe, you can do so from unsubscribe links included in every newsletter email.'
    };
  }

  @Post('unsubscribe/:email')
  @HttpCode(200)
  async unsubscribeFromNewsletter(@Param() { email }: EncryptedEmailDto) {
    const unencryptedEmail = await this.blogSubscription.unsubscribeFromNewsletter(
      email
    );
    return {
      message: `Your email address ${unencryptedEmail} has successfully unsubscribed from Voya Code\'s newsletter`
    };
  }

  @Post('push/subscribe')
  @HttpCode(200)
  async subscribeToPushNotifications(
    @Body() subscriptionInfo: PushSubscriptionDto
  ) {
    const topic = 'blogs';
    const subscription = await this.pushService.subscribe(subscriptionInfo);
    await this.pushService.subscribeToTopic(subscription, topic);
    return {
      message: 'Push notification subscription successful.'
    };
  }

  @Post('push/unsubscribe')
  @HttpCode(200)
  async unsubscribeFromPushNotifications(
    @Body() subscriptionInfo: PushSubscriptionDto
  ) {
    const topic = 'blogs';
    await this.pushService.unsubscribeFromTopic(
      subscriptionInfo.endpoint,
      topic
    );
    return {
      message: 'Successfully unsubscribed from blog push notifications.'
    };
  }
}
