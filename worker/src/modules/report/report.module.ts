import { Module } from '@nestjs/common';
import { ReportController } from './report.controller';
import { FileModule } from 'modules/file/file.module';
import { ReportService } from './report.service';

@Module({
  imports: [FileModule],
  controllers: [ReportController],
  providers: [ReportService],
})
export class ReportModule {}
