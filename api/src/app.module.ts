import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ReportModule } from 'modules/report/report.module';
import { EnvironmentVariables } from './env.validation';
import { makeValidatorForClass } from 'common/environment';
import { HealthController } from 'common/health';
import { LoggerMiddleware, LoggerModule } from 'common/logger';
@Module({
  imports: [
    ConfigModule.forRoot({
      validate: makeValidatorForClass(EnvironmentVariables),
      isGlobal: true,
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
