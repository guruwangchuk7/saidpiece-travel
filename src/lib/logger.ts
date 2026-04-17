/**
 * Production-ready structured logger.
 * In a real-world scenario, this could send logs to Axiom, Datadog, or Sentry.
 */
export const logger = {
  info: (message: string, context?: Record<string, any>) => {
    console.log(JSON.stringify({ level: 'info', message, ...context, timestamp: new Date().toISOString() }));
  },
  warn: (message: string, context?: Record<string, any>) => {
    console.warn(JSON.stringify({ level: 'warn', message, ...context, timestamp: new Date().toISOString() }));
  },
  error: (message: string, error?: any, context?: Record<string, any>) => {
    const errorData = error instanceof Error ? { name: error.name, message: error.message, stack: error.stack } : error;
    console.error(JSON.stringify({ 
      level: 'error', 
      message, 
      error: errorData, 
      ...context, 
      timestamp: new Date().toISOString() 
    }));
  },
  perf: (label: string, durationMs: number, context?: Record<string, any>) => {
    console.log(JSON.stringify({ level: 'perf', label, durationMs, ...context, timestamp: new Date().toISOString() }));
  }
};
