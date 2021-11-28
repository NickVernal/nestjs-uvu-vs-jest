import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { v4 as uuid } from 'uuid';

import { apiKeyHeader } from '../../constants';
import { env } from '../../config';
import { routes } from '../../routes';
import {
  clearTables,
  dropConnections,
  setup,
  getCategories,
  createCategory,
} from '../../utils/tests';
import { createMask } from '../../utils/mask-fields';
import { buildRoute } from '../../utils/build-route';
import { ErrorName } from '../../common/errors/error-name';

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

  describe('Receive one category:', () => {
    const baseRoute = routes.root + routes.categories.receiveOne;

    it('No auth header -> 401', async () => {
      const { id } = await createCategory();
      const route = buildRoute(baseRoute, { id });
      const response = await request(app.getHttpServer()).get(route);
      expect(response.statusCode).toEqual(401);
    });

    it('Wrong auth header -> 401', async () => {
      const { id } = await createCategory();
      const route = buildRoute(baseRoute, { id });
      const response = await request(app.getHttpServer())
        .get(route)
        .set(apiKeyHeader, env.API_KEY + 'x');
      expect(response.statusCode).toEqual(401);
    });

    it('Correct auth header, no such category -> 400, CATEGORY_DOES_NOT_EXIST_ERROR', async () => {
      const id = uuid();
      const route = buildRoute(baseRoute, { id });
      const response = await request(app.getHttpServer())
        .get(route)
        .set(apiKeyHeader, env.API_KEY);
      expect(response.statusCode).toEqual(400);
      expect(response.body.message).toEqual(
        ErrorName.CategoryDoesNotExistError,
      );
    });

    it('Correct auth header, category exists -> 200', async () => {
      const { id } = await createCategory();
      const route = buildRoute(baseRoute, { id });
      const response = await request(app.getHttpServer())
        .get(route)
        .set(apiKeyHeader, env.API_KEY);
      expect(response.statusCode).toEqual(200);
      expect(mask(response.body)).toMatchSnapshot();
    });
  });

  describe('Trigger magic:', () => {
    const baseRoute = routes.root + routes.categories.magic;

    it('No auth header -> 401', async () => {
      const { id } = await createCategory();
      const route = buildRoute(baseRoute, { id });
      const response = await request(app.getHttpServer()).post(route);
      expect(response.statusCode).toEqual(401);
    });

    it('Wrong auth header -> 401', async () => {
      const { id } = await createCategory();
      const route = buildRoute(baseRoute, { id });
      const response = await request(app.getHttpServer())
        .post(route)
        .set(apiKeyHeader, env.API_KEY + 'x');
      expect(response.statusCode).toEqual(401);
    });

    it('Correct auth header, no such category -> 400, CATEGORY_DOES_NOT_EXIST_ERROR', async () => {
      const id = uuid();
      const route = buildRoute(baseRoute, { id });
      const response = await request(app.getHttpServer())
        .post(route)
        .set(apiKeyHeader, env.API_KEY);
      expect(response.statusCode).toEqual(400);
      expect(response.body.message).toEqual(
        ErrorName.CategoryDoesNotExistError,
      );
    });

    it('Correct auth header, category exists, cant perform magic -> 400, CATEGORY_CAN_NOT_DO_MAGIC_ERROR', async () => {
      const { id } = await createCategory({ canDoMagic: false });
      const route = buildRoute(baseRoute, { id });
      const response = await request(app.getHttpServer())
        .post(route)
        .set(apiKeyHeader, env.API_KEY);
      expect(response.statusCode).toEqual(400);
      expect(response.body.message).toEqual(
        ErrorName.CategoryCanNotDoMagicError,
      );
    });

    it('Correct auth header, category exists -> 201', async () => {
      const { id } = await createCategory();
      const route = buildRoute(baseRoute, { id });
      const response = await request(app.getHttpServer())
        .post(route)
        .set(apiKeyHeader, env.API_KEY);
      expect(response.statusCode).toEqual(201);
      expect(mask(response.body)).toMatchSnapshot();
      expect(response.body?.payload?.canDoMagic).toStrictEqual(false);

      const [category] = await getCategories();
      expect(mask(category as any)).toMatchSnapshot();
    });

    it('Race condition', async () => {
      const { id } = await createCategory();
      const route = buildRoute(baseRoute, { id });

      const responses = await Promise.all(
        new Array(10)
          .fill(0)
          .map(() =>
            request(app.getHttpServer())
              .post(route)
              .set(apiKeyHeader, env.API_KEY),
          ),
      );

      const failed = responses.filter(
        ({ statusCode, body }) =>
          statusCode === 400 &&
          body?.message === ErrorName.CategoryCanNotDoMagicError,
      );
      const [succeeded] = responses.filter(
        ({ statusCode }) => statusCode === 201,
      );
      expect(failed.length).toEqual(9);
      expect(mask(succeeded.body)).toMatchSnapshot();
    });
  });
});
