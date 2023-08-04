import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { Logger } from './logger.service';

const computeRequestEndLogContent = (
  req: Request,
  res: Response,
  requestStartTime: number,
): Record<string, unknown> => {
  const requestEndTime = new Date().getTime();
  const executionDurationMs = requestEndTime - requestStartTime;

  const { url, method } = req;
  const { statusCode, statusMessage } = res;
  const message = 'Ingoing request execution end';

  return {
    method,
    url,
    statusCode,
    statusMessage,
    executionDurationMs,
    message,
  };
};

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(private logger: Logger) {
    this.logger.setContext('LoggerMiddleware');
    this.logger.log('LoggerMiddleware()');
  }

  use(req: Request, res: Response, next: () => void): void {
    const requestStartTime = new Date().getTime();

    res.on('finish', () => {
      const requestEndLogContent = computeRequestEndLogContent(
        req,
        res,
        requestStartTime,
      );
      this.logger.log(requestEndLogContent);
    });

    next();
  }
}
