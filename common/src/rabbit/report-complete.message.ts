export class ReportComplete {
  static readonly pattern = { cmd: 'report-complete' } as const;

  taskId!: number;
  resultFileUrl!: string;
}
