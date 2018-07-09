import { EmailService } from '@core/email/email.service';
export const EmailServiceMock = jest.fn<EmailService>(() => ({
  addToMailingList: jest.fn().mockReturnValue(Promise.resolve()),
  removeFromMailingList: jest.fn().mockReturnValue(Promise.resolve),
  sendMail: jest.fn().mockReturnValue(Promise.resolve)
}));
