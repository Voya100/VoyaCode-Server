import { ServerConfigService } from '@core/server-config/server-config.service';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import WebPush from 'web-push';

import {
  PushSubscriptionEntity,
  PushSubscriptionTopicEntity
} from './entities';
import { PushSubscriptionDto } from './push-subscription.dto';

@Injectable()
export class PushService {
  constructor(
    @Inject('WebPush') private webPush: WebPush,
    @InjectRepository(PushSubscriptionEntity)
    private readonly pushSubscriptions: Repository<PushSubscriptionEntity>,
    @InjectRepository(PushSubscriptionTopicEntity)
    private readonly pushSubscriptionTopics: Repository<
      PushSubscriptionTopicEntity
    >,
    config: ServerConfigService
  ) {
    this.webPush.setVapidDetails(
      'https://voyacode.com',
      config.pushNotifications.vapidPublicKey,
      config.pushNotifications.vapidPrivateKey
    );
  }

  /**
   * Creates new PushSubscription to database if it doesn't already exists.
   * Returns either existing or just created PushSubscriptionEntity.
   */
  async subscribe(
    subscriptionInfo: PushSubscriptionDto
  ): Promise<PushSubscriptionEntity> {
    let subscription: PushSubscriptionEntity = await this.pushSubscriptions.findOne(
      subscriptionInfo.endpoint
    );
    if (subscription === undefined) {
      // Subscription doesn't exist yet in database
      subscription = this.pushSubscriptions.create(subscriptionInfo);
      subscription = await this.pushSubscriptions.save(subscription);
    }
    return subscription;
  }

  async subscribeToTopic(subscription: PushSubscriptionEntity, topic: string) {
    const topicEntity = this.pushSubscriptionTopics.create({
      subscription,
      name: topic
    });
    await this.pushSubscriptionTopics.save(topicEntity);
  }

  async unsubscribeFromTopic(subscriptionEndpoint: string, topic: string) {
    await this.pushSubscriptionTopics.manager.transaction(
      async entityManager => {
        const topicSubscription = await entityManager.findOne(
          PushSubscriptionTopicEntity,
          {
            relations: ['subscription'],
            where: {
              subscription: { endpoint: subscriptionEndpoint },
              name: topic
            }
          }
        );
        if (!topicSubscription) {
          throw new BadRequestException(
            'Subscription does not exist or is already removed.'
          );
        }
        const subscription = topicSubscription.subscription;
        await entityManager.remove(topicSubscription);

        const remainingTopics = await entityManager.count(
          PushSubscriptionTopicEntity,
          { subscription }
        );
        // If user is no longer subscribed to any topic,
        // their subscription details can be removed.
        if (remainingTopics === 0) {
          await entityManager.remove(subscription);
        }
      }
    );
  }

  async getSubscriptionsByTopic(
    topic: string
  ): Promise<PushSubscriptionEntity[]> {
    const topicSubscriptions = await this.pushSubscriptionTopics.find({
      where: { topic },
      relations: ['subscription']
    });
    return topicSubscriptions.map(
      topicSubscription => topicSubscription.subscription
    );
  }

  async sendNotifications(
    subscriptions: PushSubscriptionEntity[],
    { title, body, data }: { title: string; body: string; data?: any }
  ): Promise<string> {
    // TODO: check payload content
    const payload = {
      notification: {
        title,
        body,
        icon: 'images/favicons/mstile-150x150.png',
        vibrate: [100, 50, 100],
        renotify: true,
        requireInteraction: true
      },
      data,
      actions: [{ action: 'goto', title: 'Go to the site' }]
    };

    const errors: Error[] = [];

    await Promise.all(
      subscriptions.map(subscription => {
        return this.webPush
          .sendNotification(
            { endpoint: subscription.endpoint, keys: subscription.keys },
            JSON.stringify(payload)
          )
          .catch(err => errors.push(err));
      })
    );
    const sentSuccessfully = subscriptions.length - errors.length;
    const message = `${sentSuccessfully}/${
      subscriptions.length
    } sent successfully.`;
    if (errors.length !== 0) {
      // TODO: Better logging mechanism
      console.warn('Push notifications failed', errors);
      throw new Error(message + ` Errors: \n${JSON.stringify(errors)}`);
    }
    return message;
  }
}
