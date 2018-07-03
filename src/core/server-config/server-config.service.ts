import { Injectable } from '@nestjs/common';
import { ServerConfig } from './server-config.interface';

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
      entitiesDir: string;
      migrationsDir: string;
      subscribersDir: string;
    };
  };
  env: string;
  port?: number;
  tokenSecret: string;
  users: { admin: { username: string; admin: boolean; password: string } };
  mailgun: { apiKey: string; domain: string };
  encryptPassword: string;
  constructor(environment: string) {
    // Fetch correct configs for the environment
    Object.assign(this, require(`./config.${environment}.ts`).config);
  }
}
