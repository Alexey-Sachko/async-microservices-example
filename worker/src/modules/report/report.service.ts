import { EnvironmentVariables } from '@/src/env.validation';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientProxy } from '@nestjs/microservices';
import axios, { AxiosInstance } from 'axios';
import { Logger } from 'common/logger';
import {
  GenerateReportMessage,
  ReportComplete,
  ReportProcessError,
  ReportProcessStart,
} from 'common/rabbit';
import { FileService } from 'modules/file/file.service';
import * as xlsx from 'xlsx';

@Injectable()
export class ReportService {
  axiosInstance: AxiosInstance;

  constructor(
    private readonly fileService: FileService,
    @Inject('API_SERVICE') private client: ClientProxy,
    private readonly configService: ConfigService<EnvironmentVariables>,
    private readonly logger: Logger,
  ) {
    this.axiosInstance = axios.create({
      baseURL: this.configService.get('SOURCE_API_URL', { infer: true }),
    });
  }

  async generateProductsReport(message: GenerateReportMessage) {
    try {
      this.client.emit<any, ReportProcessStart>(ReportProcessStart.pattern, {
        taskId: message.taskId,
      });

      const res = await this.axiosInstance.get('/products');

      // simulate long processing
      await new Promise((resolve) => setTimeout(resolve, 5000));

      const { products } = res.data;
      const firstProduct = products[0];

      const Headers = Object.keys(firstProduct);
      const Data = products.map((product: any) => Object.values(product));

      const workbook = xlsx.utils.book_new();
      const worksheet = xlsx.utils.aoa_to_sheet([]);

      xlsx.utils.book_append_sheet(workbook, worksheet);
      xlsx.utils.sheet_add_aoa(worksheet, [Headers], { origin: 'A1' });
      xlsx.utils.sheet_add_aoa(worksheet, Data, { origin: 'A2' });

      const xlsxBuffer = xlsx.write(workbook, {
        type: 'buffer',
        bookType: 'xlsx',
      });

      const uploadRes = await this.fileService.uploadFile(xlsxBuffer, 'xlsx');

      this.client.emit<any, ReportComplete>(ReportComplete.pattern, {
        taskId: message.taskId,
        resultFileUrl: uploadRes.url,
      });

      return uploadRes;
    } catch (error) {
      let errorMessage = 'Something went wrong while generating report';
      if (error instanceof Error) {
        this.logger.error(error.message, error.stack);
        errorMessage = error.message;
      } else {
        this.logger.error('Something went wrong while generating report');
      }

      this.client.emit<any, ReportProcessError>(ReportProcessError.pattern, {
        errorMessage,
        taskId: message.taskId,
      });
    }
  }
}
