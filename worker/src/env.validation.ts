import { IsNumber } from 'class-validator';

export class EnvironmentVariables {
  @IsNumber()
  SERVER_PORT!: number;
}
