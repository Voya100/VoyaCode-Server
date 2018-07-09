import { Injectable } from '@nestjs/common';

import { EncryptService } from '@core/encrypt/encrypt.service';
import mailgunConstructor from 'mailgun-js';

@Injectable()
export class EmailService {
  constructor(
    private encryptService: EncryptService,
    // Mailgun interface is not exported from typings:
    // Only way to get its type is by default initializing it here
    private mailgun = mailgunConstructor({ apiKey: '', domain: '' })
  ) {}

  addToMailingList(email: string, list: string) {
    const encodedEmail = this.encryptService.urlEncrypt(email);
    return this.mailgun
      .lists(list)
      .members()
      .create({
        address: email,
        name: email.split('@')[0],
        subscribed: true,
        vars: { encodedEmail }
      });
  }

  removeFromMailingList(email: string, list: string) {
    return this.mailgun
      .lists(list)
      .members(email)
      .update({ name: email.split('@')[0], subscribed: false });
  }

  sendMail(
    fromEmail: string,
    toEmail: string,
    subject: string,
    text: string,
    tags = {}
  ) {
    const data = {
      from: fromEmail,
      to: toEmail,
      subject,
      'h:X-Mailgun-Track-Clicks': 'no',
      text,
      ...tags
    };
    return this.mailgun.messages().send(data);
  }
}
