declare module 'web-push' {
  interface PushSubscription {
    endpoint: string;
    keys: {
      p256dh: string;
      auth: string;
    };
  }

  interface Options {
    headers: any;
    gcmAPIKey: string;
    vapidDetails: string;
    TTL: number;
    contentEncoding: string;
    proxy: string;
  }

  interface NotificationOptions {
    body: string;
    icon: string;
    image: string;
    badge: string;
    vibrate: number[];
    sound: string;
    dir: 'auto' | 'ltr' | 'rtl';
    tag: string;
    data: any;
    requireInteraction: boolean;
    renotify: boolean;
    silent: boolean;
    actions: string[];
    timestamp: number;
  }

  // Incomplete types, unimplemented (and unused) types commented out
  export class WebPush {
    // WebPushError: WebPushError,
    // supportedContentEncodings: WebPushConstants.supportedContentEncodings,
    // encrypt: encryptionHelper.encrypt,
    // getVapidHeaders: vapidHelper.getVapidHeaders,
    generateVAPIDKeys: () => { publicKey: string; privateKey: string };
    // setGCMAPIKey: webPush.setGCMAPIKey,
    setVapidDetails: (
      subject: string,
      publicKey: string,
      privateKey: string
    ) => void;
    // generateRequestDetails: webPush.generateRequestDetails,
    sendNotification: (
      subscription: PushSubscription,
      payload: string,
      notificationOptions?: NotificationOptions
    ) => Promise<void>;
  }

  export class WebPushError extends Error {
    name: string;
    message: any;
    statusCode: number;
    headers: any;
    body: any;
    endpoint: string;
  }

  export default WebPush;
}
