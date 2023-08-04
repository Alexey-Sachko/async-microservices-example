import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class ReportService {
  constructor(@Inject('WORKER_SERVICE') private client: ClientProxy) {}

  async generateReport() {
    return this.client.send(
      { cmd: 'generate-report' },
      { someReportData: 'asadadad' },
    );
  }
}
