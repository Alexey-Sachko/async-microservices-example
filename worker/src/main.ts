import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Transport } from '@nestjs/microservices';
import { EnvironmentVariables } from './env.validation';
import { Logger } from 'common/logger';

const apiPath = 'api/v1';

async function bootstrap() {
  const { AppModule } = await import('./app.module');
  const logger = new Logger();
  const app = await NestFactory.create(AppModule, { logger });
  const configService = app.get(ConfigService<EnvironmentVariables, true>);
  app.setGlobalPrefix(apiPath);

  app.connectMicroservice({
    transport: Transport.RMQ,
    options: {
      urls: [configService.get('RABBITMQ_URL', { infer: true })],
      queue: configService.get('RABBIT_MQ_WORKER_QUEUE', { infer: true }),
      prefetchCount: 1,
    },
    logger,
  });

  const options = new DocumentBuilder()
    .setTitle('Reports worker microservice')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, options);

  // JSON and YAML files are available at `${path}-json` and `${path}-yaml`
  SwaggerModule.setup(`${apiPath}/swagger`, app, document);

  await app.startAllMicroservices();
  const server = await app.listen(
    configService.get('SERVER_PORT', { infer: true }),
  );
  server.keepAliveTimeout = 60000;
}
bootstrap();
