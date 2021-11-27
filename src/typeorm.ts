import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { env } from './config';

export const defaultDbOptions: TypeOrmModuleOptions = {
  type: 'postgres',
  host: env.POSTGRES_HOST,
  port: env.POSTGRES_PORT,
  username: env.POSTGRES_USER,
  password: env.POSTGRES_PASSWORD,
  database: env.POSTGRES_DATABASE,
  entities: ['src/**/*.entity.ts'],
  migrations: ['database/default/*.ts'],
  cli: {
    migrationsDir: 'database/default',
  },
};
