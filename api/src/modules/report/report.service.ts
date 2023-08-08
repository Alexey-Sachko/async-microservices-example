import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import {
  GenerateReportMessage,
  ReportComplete,
  ReportProcessError,
  ReportProcessStart,
} from 'common/rabbit';
import { Repository } from 'typeorm';
import { ReportTask } from './report-task.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ReportStatus } from './report-status.enum';

@Injectable()
export class ReportService {
  constructor(
    @Inject('WORKER_SERVICE') private client: ClientProxy,

    @InjectRepository(ReportTask)
    private readonly reportTaskRepository: Repository<ReportTask>,
  ) {}

  async generateReport(): Promise<ReportTask> {
    const reportTask = await this.reportTaskRepository.save({
      status: ReportStatus.PENDING,
    });

    this.client.emit<any, GenerateReportMessage>(
      GenerateReportMessage.pattern,
      {
        taskId: reportTask.id,
      },
    );

    return reportTask;
  }

  async getReportTask(id: number): Promise<ReportTask | null> {
    return this.reportTaskRepository.findOneBy({ id });
  }

  async getAllReportTasks(): Promise<ReportTask[]> {
    return this.reportTaskRepository.find();
  }

  async reportComplete(message: ReportComplete): Promise<void> {
    await this.reportTaskRepository.update(message.taskId, {
      status: ReportStatus.COMPLETED,
      resultFileUrl: message.resultFileUrl,
    });
  }

  async reportProcessStart(message: ReportProcessStart): Promise<void> {
    await this.reportTaskRepository.update(message.taskId, {
      status: ReportStatus.PROCESSING,
    });
  }

  async reportProcessError(message: ReportProcessError): Promise<void> {
    await this.reportTaskRepository.update(message.taskId, {
      status: ReportStatus.FAILED,
      errorMessage: message.errorMessage,
    });
  }
}
