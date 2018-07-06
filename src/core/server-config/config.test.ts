import { ServerConfig } from '@core/server-config/server-config.interface';
import { config as devConfig } from './config.development';

const database = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  database: 'voyacode-test',
  username: 'postgres',
  password: 'postgres',
  entities: ['src/**/**.entity{.ts,.js}'],
  // Reset database on each connection
  synchronize: true,
  dropSchema: true
};

export const config: ServerConfig = { ...devConfig, database };
