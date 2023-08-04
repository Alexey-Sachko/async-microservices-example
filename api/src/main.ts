import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { EnvironmentVariables } from './env.validation';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger } from 'common/logger';

const apiPath = 'api/v1';

async function bootstrap() {
  const { AppModule } = await import('./app.module');
  const logger = new Logger();
  const app = await NestFactory.create(AppModule, { logger });
  const configService = app.get(ConfigService<EnvironmentVariables, true>);
  app.setGlobalPrefix(apiPath);

  const options = new DocumentBuilder()
    .setTitle('Reports API')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, options);

  // JSON and YAML files are available at `${path}-json` and `${path}-yaml`
  SwaggerModule.setup(`${apiPath}/swagger`, app, document);

  const server = await app.listen(
    configService.get('SERVER_PORT', { infer: true }),
  );
  server.keepAliveTimeout = 60000;
}
bootstrap();
