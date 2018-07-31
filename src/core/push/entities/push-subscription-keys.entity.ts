import { IsBase64 } from 'class-validator';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('push-subscription-keys', { schema: 'public' })
export class PushSubscriptionKeysEntity {
  @PrimaryGeneratedColumn() id: string;

  @IsBase64({ message: 'p256dh must be base64 string.' })
  @Column()
  p256dh: string;

  @IsBase64({ message: 'auth must be base64 string.' })
  @Column()
  auth: string;
}
