export class GenerateReportMessage {
  static readonly pattern = { cmd: 'generate-report' } as const;

  taskId!: number;
}
