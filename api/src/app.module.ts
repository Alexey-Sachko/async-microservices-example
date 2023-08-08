import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportModule } from 'modules/report/report.module';
import { EnvironmentVariables } from './env.validation';
import { makeValidatorForClass } from 'common/environment';
import { HealthController } from 'common/health';
import { LoggerMiddleware, LoggerModule } from 'common/logger';
import { ReportTask } from 'modules/report/report-task.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: makeValidatorForClass(EnvironmentVariables),
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.TYPEORM_URL,
      entities: [ReportTask],
      synchronize: process.env.TYPEORM_SYNCHRONIZE === 'true',
    }),
    ReportModule,
    LoggerModule,
  ],
  controllers: [HealthController],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(LoggerMiddleware)
      .exclude({ path: '/health', method: RequestMethod.ALL })
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
