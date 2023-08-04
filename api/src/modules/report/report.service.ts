import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { GenerateReportMessage } from 'common/rabbit';

@Injectable()
export class ReportService {
  constructor(@Inject('WORKER_SERVICE') private client: ClientProxy) {}

  async generateReport() {
    // Get url from params
    // Create entity in database
    // Send also the id from database
    // After returning the response, update the entity in database and return the result

    return this.client.send<any, GenerateReportMessage>(
      GenerateReportMessage.pattern,
      {
        url: 'https://www.google.com',
      },
    );
  }
}
