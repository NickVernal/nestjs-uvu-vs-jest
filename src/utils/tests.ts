import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getConnection, getManager } from 'typeorm';
import { Category } from '../categories/categories.entity';
import { AppModule } from '../app.module';
import { env } from '../config';
import { setupApp } from './setup-app';

export async function clearTables() {
  const connection = getConnection();
  const entities = connection.entityMetadatas;

  for (const entity of entities) {
    const repository = await connection.getRepository(entity.name);
    await repository.query(`DELETE FROM ${entity.tableName};`);
  }
}

export async function setup(): Promise<INestApplication> {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  const app = moduleFixture.createNestApplication();
  setupApp(app);
  await app.init();
  return app;
}

export async function dropConnections(): Promise<void> {
  await getConnection().query(`
    SELECT pg_terminate_backend(pg_stat_activity.pid)
    FROM pg_stat_activity
    WHERE pg_stat_activity.datname = '${env.POSTGRES_DATABASE}' AND pid <> pg_backend_pid();
  `);
}

export async function getCategories(): Promise<Category[]> {
  return getManager()
    .getRepository(Category)
    .find({ order: { slug: 'ASC' } });
}

export async function createCategory(
  data: Partial<Category> = {},
): Promise<Category> {
  return getManager()
    .getRepository(Category)
    .save({
      name: 'Clothes',
      slug: 'clothes',
      ...data,
    });
}
