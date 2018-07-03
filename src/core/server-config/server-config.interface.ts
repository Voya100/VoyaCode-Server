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
    migrations: string[];
    migrationsRun: boolean;
    cli: {
      entitiesDir: string;
      migrationsDir: string;
      subscribersDir: string;
    };
  };
  tokenSecret: string;
  users: {
    admin: {
      username: string;
      admin: boolean;
      password: string;
    };
  };
  mailgun: {
    apiKey: string;
    domain: string;
  };
  encryptPassword: string;
}
