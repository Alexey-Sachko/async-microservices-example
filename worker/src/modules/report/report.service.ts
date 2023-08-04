import { EnvironmentVariables } from '@/src/env.validation';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';
import { FileService } from 'modules/file/file.service';
import * as xlsx from 'xlsx';

@Injectable()
export class ReportService {
  axiosInstance: AxiosInstance;

  constructor(
    private readonly fileService: FileService,
    private readonly configService: ConfigService<EnvironmentVariables>,
  ) {
    this.axiosInstance = axios.create({
      baseURL: this.configService.get('SOURCE_API_URL', { infer: true }),
    });
  }

  async generateProductsReport() {
    const res = await this.axiosInstance.get('/products');

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
    return uploadRes;
  }
}
