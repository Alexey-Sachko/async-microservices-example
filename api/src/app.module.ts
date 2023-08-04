import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ReportModule } from 'modules/report/report.module';
import { EnvironmentVariables } from './env.validation';
import { makeValidatorForClass } from 'common/environment';
import { HealthController } from 'common/health';

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: makeValidatorForClass(EnvironmentVariables),
      isGlobal: true,
    }),
    ReportModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
