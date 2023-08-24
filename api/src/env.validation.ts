import { IsNumber, IsString } from 'class-validator';

export class EnvironmentVariables {
  @IsNumber()
  SERVER_PORT!: number;

  @IsString()
  RABBITMQ_URL!: string;

  @IsString()
  RABBIT_MQ_API_QUEUE!: string;

  @IsString()
  RABBIT_MQ_WORKER_QUEUE!: string;

  @IsString()
  TYPEORM_URL!: string;

  @IsString()
  TYPEORM_SYNCHRONIZE!: string;
}
