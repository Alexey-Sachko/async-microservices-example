import { Controller, Get, Param } from '@nestjs/common';
import { ReportService } from './report.service';
import { ReportTaskDto } from './dto/report-task.dto';

@Controller('reports')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Get('generate')
  async generateReport(): Promise<ReportTaskDto> {
    return this.reportService.generateReport();
  }

  @Get(':id')
  async getReportTask(
    @Param('id')
    id: number,
  ): Promise<ReportTaskDto | null> {
    return this.reportService.getReportTask(id);
  }

  @Get()
  async getAllReportTasks(): Promise<ReportTaskDto[]> {
    return this.reportService.getAllReportTasks();
  }
}
