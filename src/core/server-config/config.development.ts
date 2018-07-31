import { sharedConfig } from '@core/server-config/config.shared';
import { ServerConfig } from '@core/server-config/server-config.interface';

const devConfig = {
  env: 'development',
  port: 8000,
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
      migrationsDir: 'migration'
    },
    logging: true
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
      unhashedPassword: 'test-password',
      password: '$2b$10$MaA8AtI9xIIKx2ommxr9duNq186fCmuPOyNnIZlJgsA.6mNPtghaW'
    }
  },
  mailgun: {
    apiKey: 'fake-key',
    domain: 'voyacode.com'
  },
  pushNotifications: {
    vapidPublicKey:
      'BBwhwrEOajWSl6QZQwiYIxeOyh0ck8F-vMR_t9PRui6y28o_qb5StvASPJ6WliMns9asM4PvhIbKvja_lR8GAdQ',
    vapidPrivateKey: 'ME-bLeEbpZun6P8894qku92jH21g9u2WRXBRwacojuw'
  },
  encryptPassword: 'h=H85Z$A<PJd[]Zx?=emj=J_Wa.7"QQ5WFAZ)LQ{MPU'
};

export const config: ServerConfig = { ...sharedConfig, ...devConfig };
