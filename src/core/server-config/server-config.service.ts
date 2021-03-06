import { ServerConfig } from '@core/server-config/server-config.interface';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ServerConfigService implements ServerConfig {
  database: {
    type: string;
    host: string;
    port: number;
    database: string;
    username: string;
    password: string;
    entities: string[];
    synchronize: boolean;
    migrations: string[];
    migrationsRun: boolean;
    cli: {
      entitiesDir?: string;
      migrationsDir: string;
      subscribersDir: string;
    };
  };
  env: string;
  port?: number;
  jwt: {
    tokenSecret: string;
    expiryTime: number;
  };
  users: {
    [username: string]: {
      username: string;
      role: string;
      password: string;
      unhashedPassword?: string;
    };
  };
  pushNotifications: {
    vapidPublicKey: string;
    vapidPrivateKey: string;
  };
  mailgun: { apiKey: string; domain: string };
  encryptPassword: string;
  constructor(environment: string) {
    // Fetch correct configs for the environment
    Object.assign(this, require(`./config.${environment}.ts`).config);
  }
}
