import { EnvironmentVariables } from '@/src/env.validation';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3 } from 'aws-sdk';
import { v4 as uuidV4 } from 'uuid';

@Injectable()
export class FileService {
  S3: S3;

  constructor(
    private readonly configService: ConfigService<EnvironmentVariables>,
  ) {
    this.S3 = new S3({
      accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID'),
      secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY'),
      endpoint: this.configService.get('AWS_ENDPOINT_URL'),
      s3ForcePathStyle: true,
    });
  }

  private getBucketName(): string {
    const bucketName = this.configService.get('AWS_S3_BUCKET');
    if (!bucketName) {
      throw new Error('AWS_S3_BUCKET is not defined');
    }
    return bucketName;
  }

  async uploadFile(file: Buffer, extension: string) {
    const key = `${uuidV4()}.${extension}`;

    const res = await this.S3.upload({
      Bucket: this.getBucketName(),
      Key: key,
      Body: file,
      ACL: 'public-read',
      ContentDisposition: 'attachment',
    }).promise();

    return {
      key,
      url: res.Location,
    };
  }
}
