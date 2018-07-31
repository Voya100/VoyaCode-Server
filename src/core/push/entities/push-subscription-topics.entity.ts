import { Entity, ManyToOne, PrimaryColumn } from 'typeorm';

import { PushSubscriptionEntity } from './push-subscription.entity';

// User may choose to get notifications only from the selected topics
// As of writing, 'blogs' is the only topic
@Entity('push-subscription-topic', { schema: 'public' })
export class PushSubscriptionTopicEntity {
  @ManyToOne(
    () => PushSubscriptionEntity,
    subscription => subscription.topics,
    { primary: true }
  )
  subscription: PushSubscriptionEntity;

  @PrimaryColumn() name: string;
}
