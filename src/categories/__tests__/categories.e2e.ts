import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

import { apiKeyHeader } from '../../constants';
import { env } from '../../config';
import { routes } from '../../routes';
import {
  clearTables,
  dropConnections,
  setup,
  getCategories,
} from '../../utils/tests';
import { createMask } from '../../utils/mask-fields';

import { CreateCategoryRequestData } from '../dto/create.dto';

let app: INestApplication;

beforeAll(async () => {
  app = await setup();
});

afterEach(async () => {
  await clearTables();
});

afterAll(async () => {
  await dropConnections();
  await app.close();
});

const mask = createMask(['id']);

describe('Categories:', () => {
  describe('Create category:', () => {
    const route = routes.root + routes.categories.create;
    it('No auth header -> 401', async () => {
      const response = await request(app.getHttpServer())
        .post(route)
        .send({
          description: '1234',
          name: '1234',
          slug: '1234',
        } as CreateCategoryRequestData);
      expect(response.statusCode).toEqual(401);
    });

    it('Wrong auth header -> 401', async () => {
      const response = await request(app.getHttpServer())
        .post(route)
        .set(apiKeyHeader, env.API_KEY + 'x')
        .send({
          description: '1234',
          name: '1234',
          slug: '1234',
        } as CreateCategoryRequestData);
      expect(response.statusCode).toEqual(401);
    });

    it('Correct auth header, no required data -> 400', async () => {
      const response = await request(app.getHttpServer())
        .post(route)
        .set(apiKeyHeader, env.API_KEY);
      expect(response.statusCode).toEqual(400);
      expect(response.body).toMatchSnapshot();
    });

    it('Correct auth header, only required fields -> 201', async () => {
      const dataToCreate: CreateCategoryRequestData = {
        name: '1234',
        slug: '12345678',
      };

      const response = await request(app.getHttpServer())
        .post(route)
        .set(apiKeyHeader, env.API_KEY)
        .send(dataToCreate);

      expect(response.statusCode).toEqual(201);
      expect(mask(response.body)).toMatchSnapshot();
      expect(response.body?.payload).toMatchObject(dataToCreate);

      const [category] = await getCategories();
      expect(category).toMatchObject(dataToCreate);
    });

    it('Correct auth header, all fields -> 201', async () => {
      const dataToCreate: CreateCategoryRequestData = {
        name: '1234',
        slug: '12345678',
        description: '1234',
      };

      const response = await request(app.getHttpServer())
        .post(route)
        .set(apiKeyHeader, env.API_KEY)
        .send(dataToCreate);

      expect(response.statusCode).toEqual(201);
      expect(mask(response.body)).toMatchSnapshot();
      expect(response.body?.payload).toMatchObject(dataToCreate);

      const [category] = await getCategories();
      expect(category).toMatchObject(dataToCreate);
    });
  });
});
