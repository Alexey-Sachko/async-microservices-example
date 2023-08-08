import { Controller } from '@nestjs/common';
import {
  MessagePattern,
  Payload,
  Ctx,
  RmqContext,
} from '@nestjs/microservices';
import {
  ReportProcessStart,
  ReportProcessError,
  ReportComplete,
} from 'common/rabbit';
import { ReportService } from './report.service';
import { Logger } from 'common/logger';

@Controller()
export class ReportMessageController {
  constructor(
    private readonly reportService: ReportService,
    private readonly logger: Logger,
  ) {}

  @MessagePattern(ReportProcessStart.pattern)
  async processStart(
    @Payload()
    payload: ReportProcessStart,

    @Ctx() context: RmqContext,
  ) {
    this.logger.log(
      `Received message: ${context.getPattern()} ${JSON.stringify(payload)}`,
    );
    return this.reportService.reportProcessStart(payload);
  }

  @MessagePattern(ReportProcessError.pattern)
  async processError(
    @Payload()
    payload: ReportProcessError,

    @Ctx() context: RmqContext,
  ) {
    this.logger.log(
      `Received message: ${context.getPattern()} ${JSON.stringify(payload)}`,
    );
    return this.reportService.reportProcessError(payload);
  }

  @MessagePattern(ReportComplete.pattern)
  async reportComplete(
    @Payload()
    payload: ReportComplete,

    @Ctx() context: RmqContext,
  ) {
    this.logger.log(
      `Received message: ${context.getPattern()} ${JSON.stringify(payload)}`,
    );
    return this.reportService.reportComplete(payload);
  }
}
