export class ReportProcessError {
  static readonly pattern = { cmd: 'report-process-error' } as const;

  taskId!: number;
  errorMessage!: string;
}
