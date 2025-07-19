// Logging utility with different levels and formatting

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

export interface LogEntry {
  timestamp: Date;
  level: LogLevel;
  message: string;
  data?: any;
  source?: string;
}

class Logger {
  private level: LogLevel;
  private logs: LogEntry[] = [];
  private maxLogs: number = 1000;

  constructor(level: LogLevel = LogLevel.INFO) {
    this.level = level;
  }

  private shouldLog(level: LogLevel): boolean {
    return level >= this.level;
  }

  private formatMessage(level: LogLevel, message: string, data?: any): string {
    const timestamp = new Date().toISOString();
    const levelName = LogLevel[level];
    const dataStr = data ? ` | ${JSON.stringify(data)}` : '';
    return `[${timestamp}] ${levelName}: ${message}${dataStr}`;
  }

  private addLog(level: LogLevel, message: string, data?: any, source?: string): void {
    const entry: LogEntry = {
      timestamp: new Date(),
      level,
      message,
      data,
      source,
    };

    this.logs.push(entry);

    // Keep only the last maxLogs entries
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }
  }

  debug(message: string, data?: any, source?: string): void {
    if (!this.shouldLog(LogLevel.DEBUG)) return;

    this.addLog(LogLevel.DEBUG, message, data, source);
    console.debug(this.formatMessage(LogLevel.DEBUG, message, data));
  }

  info(message: string, data?: any, source?: string): void {
    if (!this.shouldLog(LogLevel.INFO)) return;

    this.addLog(LogLevel.INFO, message, data, source);
    console.info(this.formatMessage(LogLevel.INFO, message, data));
  }

  warn(message: string, data?: any, source?: string): void {
    if (!this.shouldLog(LogLevel.WARN)) return;

    this.addLog(LogLevel.WARN, message, data, source);
    console.warn(this.formatMessage(LogLevel.WARN, message, data));
  }

  error(message: string, data?: any, source?: string): void {
    if (!this.shouldLog(LogLevel.ERROR)) return;

    this.addLog(LogLevel.ERROR, message, data, source);
    console.error(this.formatMessage(LogLevel.ERROR, message, data));
  }

  // Performance logging
  time(label: string): void {
    console.time(label);
  }

  timeEnd(label: string): void {
    console.timeEnd(label);
  }

  // Group logging
  group(label: string): void {
    console.group(label);
  }

  groupEnd(): void {
    console.groupEnd();
  }

  // Get logs
  getLogs(level?: LogLevel): LogEntry[] {
    if (level !== undefined) {
      return this.logs.filter(log => log.level >= level);
    }
    return [...this.logs];
  }

  // Clear logs
  clearLogs(): void {
    this.logs = [];
  }

  // Set log level
  setLevel(level: LogLevel): void {
    this.level = level;
  }

  // Export logs
  exportLogs(): string {
    return this.logs
      .map(log => this.formatMessage(log.level, log.message, log.data))
      .join('\n');
  }

  // Create child logger with source
  child(source: string): ChildLogger {
    return new ChildLogger(this, source);
  }
}

class ChildLogger {
  constructor(private parent: Logger, private source: string) {}

  debug(message: string, data?: any): void {
    this.parent.debug(message, data, this.source);
  }

  info(message: string, data?: any): void {
    this.parent.info(message, data, this.source);
  }

  warn(message: string, data?: any): void {
    this.parent.warn(message, data, this.source);
  }

  error(message: string, data?: any): void {
    this.parent.error(message, data, this.source);
  }

  time(label: string): void {
    this.parent.time(`${this.source}:${label}`);
  }

  timeEnd(label: string): void {
    this.parent.timeEnd(`${this.source}:${label}`);
  }

  group(label: string): void {
    this.parent.group(`${this.source}:${label}`);
  }

  groupEnd(): void {
    this.parent.groupEnd();
  }
}

// Create default logger instance
const logger = new Logger(
  process.env.NODE_ENV === 'development' ? LogLevel.DEBUG : LogLevel.INFO
);

// Export logger and utilities
export { logger };
export default logger;

// Convenience functions
export const createLogger = (source: string) => logger.child(source);

// Error boundary logger
export const logError = (error: Error, context?: string) => {
  logger.error(`${context ? `[${context}] ` : ''}${error.message}`, {
    stack: error.stack,
    name: error.name,
  });
};

// Performance logger
export const logPerformance = (label: string, fn: () => any) => {
  logger.time(label);
  try {
    const result = fn();
    logger.timeEnd(label);
    return result;
  } catch (error) {
    logger.timeEnd(label);
    throw error;
  }
};

// Async performance logger
export const logAsyncPerformance = async (label: string, fn: () => Promise<any>) => {
  logger.time(label);
  try {
    const result = await fn();
    logger.timeEnd(label);
    return result;
  } catch (error) {
    logger.timeEnd(label);
    throw error;
  }
};
