import { EmailService } from '@core/email/email.service';
import { EncryptService } from '@core/encrypt/encrypt.service';
import { BadRequestException } from '@nestjs/common';

import { EmailServiceMock } from '@test/mocks/email.service.mock';

import { BlogSubscriptionService } from '@api/blogs/blog-subscription/blog-subscription.service';

describe('BlogSubscriptionService', () => {
  let subscriptionService: BlogSubscriptionService;
  let encryptService: EncryptService;
  let emailMockService: EmailService;
  beforeEach(async () => {
    emailMockService = new EmailServiceMock();
    encryptService = {
      urlEncrypt: (text: string) =>
        text
          .split('')
          .reverse()
          .join(''),
      urlDecrypt: (text: string) =>
        text
          .split('')
          .reverse()
          .join('')
    } as EncryptService;
    // encryptService = new EncryptService({ encryptPassword: 'secret' } as any);
    subscriptionService = new BlogSubscriptionService(
      emailMockService,
      encryptService
    );
  });

  it('should be defined', () => {
    expect(subscriptionService).toBeDefined();
  });

  describe('sendSubscribeConfirmation', () => {
    it('should send subscription confirmation', async () => {
      const email = 'tester@voyacode.com';
      const spy = jest.spyOn(emailMockService, 'sendMail');
      await subscriptionService.sendSubscribeConfirmation(email);
      const encryptedEmail = encryptService.urlEncrypt(email);
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy.mock.calls[0][0]).toBe('Voya Code <blogs@voyacode.com>');
      expect(spy.mock.calls[0][1]).toBe(email);
      expect(spy.mock.calls[0][3].includes(encryptedEmail));
    });
  });

  describe('subscribeToNewsLetter', () => {
    it('should add to mailing list', async () => {
      const email = 'tester@voyacode.com';
      const encryptedEmail = encryptService.urlEncrypt(email);
      await subscriptionService.subscribeToNewsletter(encryptedEmail);
      expect(emailMockService.addToMailingList).toHaveBeenCalledWith(
        email,
        'blogs@voyacode.com'
      );
    });

    it('should throw error on invalid email encryption', async () => {
      await expect(
        subscriptionService.subscribeToNewsletter('fake-encryption')
      ).rejects.toThrow(BadRequestException);
      expect(emailMockService.addToMailingList).not.toBeCalled();
    });

    it('should throw error on invalid email that is encrypted', async () => {
      const encryptedNonEmail = encryptService.urlEncrypt('not-an-email');
      await expect(
        subscriptionService.subscribeToNewsletter(encryptedNonEmail)
      ).rejects.toThrow(BadRequestException);
      expect(emailMockService.addToMailingList).not.toBeCalled();
    });
  });

  describe('unsubscribeFromNewsLetter', () => {
    it('should remove from mailing list', async () => {
      const email = 'tester@voyacode.com';
      const encryptedEmail = encryptService.urlEncrypt(email);
      await subscriptionService.unsubscribeFromNewsletter(encryptedEmail);
      expect(emailMockService.removeFromMailingList).toHaveBeenCalledWith(
        email,
        'blogs@voyacode.com'
      );
    });

    it('should throw error on invalid email encryption', async () => {
      await expect(
        subscriptionService.unsubscribeFromNewsletter('fake-encryption')
      ).rejects.toThrow(BadRequestException);
      expect(emailMockService.removeFromMailingList).not.toBeCalled();
    });

    it('should throw error on invalid email that is encrypted', async () => {
      const encryptedNonEmail = encryptService.urlEncrypt('not-an-email');
      await expect(
        subscriptionService.unsubscribeFromNewsletter(encryptedNonEmail)
      ).rejects.toThrow(BadRequestException);
      expect(emailMockService.removeFromMailingList).not.toBeCalled();
    });
  });
});
