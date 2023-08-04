import { Controller, Get } from '@nestjs/common';
import { ReportService } from './report.service';

@Controller('reports')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Get()
  async generateReport() {
    return this.reportService.generateReport();
  }
}
