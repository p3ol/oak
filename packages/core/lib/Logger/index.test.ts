import { type Mock, vi } from 'vitest';

import Builder from '../Builder';
import Logger from './index';

/* eslint-disable no-console */
describe('Logger', () => {
  let logSpy: Mock;
  let warnSpy: Mock;

  beforeEach(() => {
    logSpy = vi.spyOn(console, 'log');
    logSpy.mockImplementation(() => {});

    warnSpy = vi.spyOn(console, 'warn');
    warnSpy.mockImplementation(() => {});
  });

  it('should log', () => {
    const logger = new Logger({
      builder: new Builder({ options: { debug: true } }),
    });

    logger.log('This is a log');
    expect(console.log).toHaveBeenCalledWith('[oak]', 'This is a log');

    logger.log('This is a log', 'with arguments');
    expect(console.log)
      .toHaveBeenCalledWith('[oak]', 'This is a log', 'with arguments');

    logger.warn('This is a warning');
    expect(console.warn).toHaveBeenCalledWith('[oak]', 'This is a warning');

    logger.warn('This is a warning', 'with arguments');
    expect(console.warn)
      .toHaveBeenCalledWith('[oak]', 'This is a warning', 'with arguments');
  });

  it('should not log but still print warnings', () => {
    const logger = new Logger({
      builder: new Builder({ options: { debug: false } }),
    });

    logger.log('This is a log');
    expect(console.log).not.toHaveBeenCalled();

    logger.warn('This is a warning');
    expect(console.warn).toHaveBeenCalled();
  });

  afterEach(() => {
    logSpy.mockClear();
    warnSpy.mockClear();
  });

  afterAll(() => {
    logSpy.mockRestore();
    warnSpy.mockRestore();
  });
});
