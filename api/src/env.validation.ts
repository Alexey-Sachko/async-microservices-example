import { IsNumber, IsString } from 'class-validator';

export class EnvironmentVariables {
  @IsNumber()
  SERVER_PORT!: number;

  @IsString()
  RABBITMQ_URL!: string;

  @IsString()
  RABBIT_MQ_QUEUE!: string;
}
