export class ReportProcessStart {
  static readonly pattern = { cmd: 'report-process-start' } as const;

  taskId!: number;
}
