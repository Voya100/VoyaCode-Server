import { BlogSubscriptionService } from '@api/blogs/blog-subscription/blog-subscription.service';
import { Body, Controller, HttpCode, Param, Post } from '@nestjs/common';

import {
  EncryptedEmailDto,
  SendSubscribeConfirmationDto
} from '@api/blogs/blog-subscription/blog-subscription.dtos';

@Controller('api/blogs')
export class BlogSubscriptionController {
  constructor(private blogSubscription: BlogSubscriptionService) {}

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
}
