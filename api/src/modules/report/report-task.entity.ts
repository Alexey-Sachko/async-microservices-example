import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ReportStatus } from './report-status.enum';

@Entity('report_task')
export class ReportTask {
  @PrimaryGeneratedColumn({ type: 'int' })
  id!: number;

  @Column({
    type: 'enum',
    enum: Object.values(ReportStatus),
    default: ReportStatus.PENDING,
  })
  status!: ReportStatus;

  @Column({ type: 'varchar', nullable: true })
  resultFileUrl!: string | null;

  @Column({ type: 'varchar', nullable: true })
  errorMessage!: string | null;
}
