import clc from 'cli-color';
import { ConsoleLogger, Injectable, Scope } from '@nestjs/common';
import winston from 'winston';

interface TransformableInfo {
  level: string;
  message: string;
  [key: string]: unknown;
}
type Message = string | Record<string, unknown>;

interface LogContent {
  message: Message;
  level: string;
}

const LOG_LEVEL_TO_COLOR: Record<string, clc.Format> = {
  error: clc.red,
  warn: clc.yellow,
  info: clc.green,
  verbose: clc.cyanBright,
  debug: clc.magentaBright,
};

const isObjectMessage = (
  message: Message,
): message is Record<string, unknown> => typeof message === 'object';

const handleObjectMessage = {
  transform: (logContent: LogContent): TransformableInfo => {
    const { message, ...restLogContent } = logContent;

    if (isObjectMessage(message)) {
      return { ...logContent, message: '', ...message };
    }

    return { ...restLogContent, message };
  },
};

const formatter = winston.format.printf((info) => {
  const colorizer = LOG_LEVEL_TO_COLOR[info.level];

  return (
    Object.keys(info)
      .reverse()
      .reduce((logString, logProperty, index) => {
        if (index > 0) {
          logString += ', ';
        }

        logString += `"${logProperty}": `;

        switch (logProperty) {
          case 'timestamp':
            logString += `"${clc.blueBright(info[logProperty])}"`;
            break;
          case 'context':
            logString += `"${clc.yellow(info[logProperty])}"`;
            break;
          default:
            logString += `"${colorizer(info[logProperty])}"`;
        }

        return logString;
      }, '{ ') + ' }'
  );
});

@Injectable({ scope: Scope.TRANSIENT })
export class Logger extends ConsoleLogger {
  private readonly logger: winston.Logger;

  constructor() {
    super();
    this.logger = winston.createLogger({
      transports: [
        new winston.transports.Console({
          level: 'debug',
          format: winston.format.combine(
            handleObjectMessage,
            winston.format.timestamp(),
            formatter,
          ),
        }),
      ],
    });
  }

  error(
    message: Message,
    trace?: string,
    context: string | undefined = this.context,
  ): void {
    this.logger.error({ message, trace, context });
  }

  warn(message: Message, context: string | undefined = this.context): void {
    this.logger.warn({ message, context });
  }

  log(message: Message, context: string | undefined = this.context): void {
    this.logger.info({ message, context });
  }

  verbose(message: Message, context: string | undefined = this.context): void {
    this.logger.verbose({ message, context });
  }

  debug(message: Message, context: string | undefined = this.context): void {
    this.logger.debug({ message, context });
  }
}
