import { IsNumber, IsString } from 'class-validator';

export class EnvironmentVariables {
  @IsNumber()
  SERVER_PORT!: number;

  @IsString()
  RABBITMQ_URL!: string;

  @IsString()
  RABBIT_MQ_QUEUE!: string;

  @IsString()
  AWS_S3_BUCKET!: string;

  @IsString()
  AWS_ACCESS_KEY_ID!: string;

  @IsString()
  AWS_SECRET_ACCESS_KEY!: string;

  @IsString()
  AWS_ENDPOINT_URL!: string;

  @IsString()
  SOURCE_API_URL!: string;
}
