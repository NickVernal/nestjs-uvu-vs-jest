import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { join } from 'path';
import { env } from './config';

export const defaultDbOptions: TypeOrmModuleOptions = {
  type: 'postgres',
  host: env.POSTGRES_HOST,
  port: env.POSTGRES_PORT,
  username: env.POSTGRES_USER,
  password: env.POSTGRES_PASSWORD,
  database: env.POSTGRES_DATABASE,
  entities: [join(__dirname, '**', '*.entity.{ts,js}')],
  migrations: [join(__dirname, '..', 'database', 'default', '*.{ts,js}')],
  cli: {
    migrationsDir: 'database/default',
  },
};
