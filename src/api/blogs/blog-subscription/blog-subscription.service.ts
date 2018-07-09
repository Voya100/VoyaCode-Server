import { EmailService } from '@core/email/email.service';
import { EncryptService } from '@core/encrypt/encrypt.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { isEmail } from 'validator';

@Injectable()
export class BlogSubscriptionService {
  private readonly mailingList = 'blogs@voyacode.com';

  constructor(
    private readonly emailService: EmailService,
    private readonly encryptService: EncryptService
  ) {}

  async sendSubscribeConfirmation(email: string) {
    const sender = 'Voya Code <blogs@voyacode.com>';
    const decryptedEmail = this.encryptService.urlEncrypt(email);
    const title = 'Confirm subscription to Voya Code newsletter';
    const message =
      'Hey,\n\n' +
      "You have chosen to subscribe to Voya Code's blog newsletter. " +
      'By subscribing you will get an email notification every time a new blog is added to Voya Code.\n\n' +
      `Please confirm your subscription by using this link: https://voyacode.com/blogs/subscribe/${decryptedEmail}` +
      '\n\n' +
      "If you didn't ask for this email, no action is needed.";
    await this.emailService.sendMail(sender, email, title, message);
  }

  async subscribeToNewsletter(encryptedEmail: string) {
    const email = await this.decryptEmail(encryptedEmail);
    await this.emailService.addToMailingList(email, this.mailingList);
    return email;
  }

  async unsubscribeFromNewsletter(encryptedEmail: string) {
    const email = await this.decryptEmail(encryptedEmail);
    await this.emailService.removeFromMailingList(email, this.mailingList);
    return email;
  }

  private async decryptEmail(encryptedEmail: string) {
    let email;
    try {
      email = await this.encryptService.urlDecrypt(encryptedEmail);
      if (!isEmail(email)) {
        throw new Error();
      }
      return email;
    } catch (e) {
      throw new BadRequestException(
        'Invalid request. Make sure that the link provided is correct.'
      );
    }
  }
}
