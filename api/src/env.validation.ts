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
  TYPEORM_ENTITIES!: string;

  @IsString()
  TYPEORM_MIGRATIONS!: string;

  @IsString()
  TYPEORM_MIGRATIONS_DIR!: string;

  @IsString()
  TYPEORM_SYNCHRONIZE!: string;
}
