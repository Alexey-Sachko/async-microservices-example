import { Controller } from '@nestjs/common';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';

@Controller()
export class ReportController {
  @MessagePattern({ cmd: 'generate-report' })
  generateReport(
    @Payload()
    payload: any,

    @Ctx()
    context: RmqContext,
  ) {
    console.log('generateReport');
    return payload;
  }
}
