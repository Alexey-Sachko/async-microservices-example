import { Module } from '@nestjs/common';
import { ReportController } from './report.controller';
import { ReportService } from './report.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { EnvironmentVariables } from '@/src/env.validation';

@Module({
  imports: [
    ClientsModule.registerAsync({
      clients: [
        {
          name: 'WORKER_SERVICE',
          inject: [ConfigService],
          useFactory: (
            configService: ConfigService<EnvironmentVariables, true>,
          ) => {
            const url = configService.get('RABBITMQ_URL', { infer: true });
            const queue = configService.get('RABBIT_MQ_QUEUE', { infer: true });
            return {
              transport: Transport.RMQ,
              options: {
                urls: [url],
                queue,
                queueOptions: {
                  durable: false,
                },
              },
            };
          },
        },
      ],
    }),
  ],
  controllers: [ReportController],
  providers: [ReportService],
})
export class ReportModule {}
