import { Controller } from '@nestjs/common';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { Logger } from 'common/logger';
import { GenerateReportMessage } from 'common/rabbit';
import { ReportService } from './report.service';

@Controller()
export class ReportController {
  constructor(
    private readonly logger: Logger,
    private readonly reportService: ReportService,
  ) {
    this.logger.setContext(ReportController.name);
  }

  @MessagePattern(GenerateReportMessage.pattern)
  generateReport(
    @Payload()
    payload: GenerateReportMessage,

    @Ctx()
    context: RmqContext,
  ) {
    this.logger.log(`Received message: ${JSON.stringify(payload)}`);
    return this.reportService.generateProductsReport();
  }
}
