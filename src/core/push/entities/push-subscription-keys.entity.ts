import { IsBase64 } from 'class-validator';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('push-subscription-keys', { schema: 'public' })
export class PushSubscriptionKeysEntity {
  @Column({ select: false })
  @PrimaryGeneratedColumn()
  id: string;

  @IsBase64({ message: 'p256dh must be base64 string.' })
  p256dh: string;

  @IsBase64({ message: 'auth must be base64 string.' })
  auth: string;
}
