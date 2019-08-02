import * as bunyan from 'bunyan';

export type Logger = bunyan;

export function createLogger(module: string, level?: bunyan.LogLevel): Logger {
  return bunyan.createLogger({
    name: module,
    level,
  });
}
