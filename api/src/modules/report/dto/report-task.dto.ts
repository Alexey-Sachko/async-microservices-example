import { Exclude, Expose } from 'class-transformer';
import { ReportStatus } from '../report-status.enum';

@Exclude()
export class ReportTaskDto {
  @Expose()
  id!: number;

  @Expose()
  status!: ReportStatus;

  @Expose()
  resultFileUrl!: string | null;

  @Expose()
  errorMessage!: string | null;
}
