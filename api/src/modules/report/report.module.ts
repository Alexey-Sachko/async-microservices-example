import { Module } from '@nestjs/common';
import { ReportController } from './report.controller';
import { ReportService } from './report.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { EnvironmentVariables } from '@/src/env.validation';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportTask } from './report-task.entity';
import { ReportMessageController } from './report-message.controller';

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
            const queue = configService.get('RABBIT_MQ_WORKER_QUEUE', {
              infer: true,
            });
            return {
              transport: Transport.RMQ,
              options: {
                urls: [url],
                queue,
              },
            };
          },
        },
      ],
    }),
    TypeOrmModule.forFeature([ReportTask]),
  ],
  controllers: [ReportController, ReportMessageController],
  providers: [ReportService],
})
export class ReportModule {}
