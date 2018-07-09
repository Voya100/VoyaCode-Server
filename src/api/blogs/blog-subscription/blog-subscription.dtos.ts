import { IsEmail, IsString } from 'class-validator';

export class SendSubscribeConfirmationDto {
  @IsEmail({}, { message: 'Email must be a valid address.' })
  email: string;
}

export class EncryptedEmailDto {
  @IsString() email: string;
}
