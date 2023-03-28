import { Builder } from '../Builder';

export declare class Logger {
  constructor(options?: { builder: Builder });
  log(...args: any[]): void;
  warn(...args: any[]): void;
}
