import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { AuthStrategy, apiKeyHeader } from './constants';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

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

  await app.listen(3000);
}
bootstrap();
