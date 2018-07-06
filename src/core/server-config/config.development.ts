import { sharedConfig } from './config.shared';
import { ServerConfig } from './server-config.interface';

const devConfig = {
  env: 'development',
  database: {
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    database: 'voyacode',
    username: 'postgres',
    password: 'postgres',
    entities: ['src/**/**.entity{.ts,.js}'],
    synchronize: false,
    migrations: ['migration/*.ts'],
    migrationsRun: true,
    cli: {
      entitiesDir: 'entity',
      migrationsDir: 'migration',
      subscribersDir: 'subscriber'
    }
  },
  jwt: {
    tokenSecret: '4cdddef5-e507-4499-ad5d-29feff6d25c1',
    expiryTime: '1h'
  },
  // Stored in configs because there is only 1 user
  // if more users are added, a database would be more appropriate storing location
  users: {
    Admin: {
      username: 'Admin',
      role: 'admin',
      password: 'test-password'
    }
  },
  mailgun: {
    apiKey: 'fake-key',
    domain: 'voyacode.com'
  },
  encryptPassword: 'h=H85Z$A<PJd[]Zx?=emj=J_Wa.7"QQ5WFAZ)LQ{MPU'
};

export const config: ServerConfig = { ...sharedConfig, ...devConfig };
