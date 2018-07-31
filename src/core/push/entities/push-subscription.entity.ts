import { IsUrl } from 'class-validator';
import {
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryColumn
} from 'typeorm';

import { PushSubscriptionKeysEntity } from './push-subscription-keys.entity';
import { PushSubscriptionTopicEntity } from './push-subscription-topics.entity';

@Entity('push-subsciption', { schema: 'public' })
export class PushSubscriptionEntity {
  @PrimaryColumn()
  @IsUrl({}, { message: 'endpoint must be a valid url.' })
  endpoint: string;

  @OneToOne(() => PushSubscriptionKeysEntity, { cascade: true, eager: true })
  @JoinColumn()
  keys: PushSubscriptionKeysEntity;

  @OneToMany(() => PushSubscriptionTopicEntity, topic => topic.subscription, {
    cascade: ['insert', 'update']
  })
  topics: PushSubscriptionTopicEntity[];
}
