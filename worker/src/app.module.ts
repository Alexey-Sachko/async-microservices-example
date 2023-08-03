import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HealthCheckModule } from 'modules/health-check/health-check.module';
import { makeValidatorForClass } from './validate';
import { EnvironmentVariables } from './env.validation';

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: makeValidatorForClass(EnvironmentVariables),
      isGlobal: true,
    }),
    HealthCheckModule,
  ],
})
export class AppModule {}
