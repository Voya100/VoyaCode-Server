export interface ServerConfig {
  env: string;
  port?: number;
  database: {
    type: string;
    host: string;
    port: number;
    database: string;
    username: string;
    password: string;
    entities: string[];
    synchronize: boolean;
    migrations?: string[];
    migrationsRun?: boolean;
    cli?: {
      entitiesDir?: string;
      migrationsDir: string;
      subscribersDir?: string;
    };
  };
  jwt: {
    tokenSecret: string;
    expiryTime: number | string;
  };
  // Only for admin account(s)
  users: {
    [username: string]: {
      username: string;
      role: string;
      password: string;
      // For development purposes
      unhashedPassword?: string;
    };
  };
  mailgun: {
    apiKey: string;
    domain: string;
  };
  pushNotifications: {
    vapidPublicKey: string;
    vapidPrivateKey: string;
  };
  encryptPassword: string;
}
