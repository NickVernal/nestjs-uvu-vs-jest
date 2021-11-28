import { INestApplication, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { apiKeyHeader, AuthStrategy } from '../constants';
import { ErrorInterceptor } from '../common/errors/error-interceptor';

export interface SetupAppOptions {
  useSwaggerDocs: boolean;
}

export function setupApp(
  app: INestApplication,
  options?: SetupAppOptions,
): INestApplication {
  if (options?.useSwaggerDocs) {
    addSwaggerDocs(app);
  }

  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.useGlobalInterceptors(new ErrorInterceptor());

  return app;
}

function addSwaggerDocs(app: INestApplication): void {
  const config = new DocumentBuilder()
    .addApiKey(
      {
        type: AuthStrategy.ApiKey, // this should be apiKey
        name: apiKeyHeader, // this is the name of the key you expect in header
        in: 'header',
      },
      AuthStrategy.ApiKey, // this is the name to show and used in swagger
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);
}
