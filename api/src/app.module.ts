import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HealthCheckModule } from 'modules/health-check/health-check.module';
import { ReportModule } from 'modules/report/report.module';
import { EnvironmentVariables } from './env.validation';
import { makeValidatorForClass } from './validate';

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: makeValidatorForClass(EnvironmentVariables),
      isGlobal: true,
      ignoreEnvFile: true,
    }),
    HealthCheckModule,
    ReportModule,
  ],
})
export class AppModule {}
