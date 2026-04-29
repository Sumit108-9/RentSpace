import winston from 'winston';

const { combine, timestamp, json, errors, printf, colorize } = winston.format;

// Custom format for development
const devFormat = printf(({ level, message, timestamp, stack, ...metadata }) => {
  let msg = `${timestamp} [${level}]: ${message}`;
  if (Object.keys(metadata).length > 0) {
    msg += ` ${JSON.stringify(metadata)}`;
  }
  if (stack) {
    msg += `\n${stack}`;
  }
  return msg;
});

export const createLogger = () => {
  const isProduction = process.env.NODE_ENV === 'production';

  const transports = [
    // Console transport
    new winston.transports.Console({
      format: isProduction
        ? combine(timestamp(), json())
        : combine(
            colorize(),
            timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
            devFormat
          ),
    }),
  ];

  // Add file transports in production
  if (isProduction) {
    transports.push(
      new winston.transports.File({
        filename: 'logs/error.log',
        level: 'error',
        format: combine(timestamp(), json()),
      }),
      new winston.transports.File({
        filename: 'logs/combined.log',
        format: combine(timestamp(), json()),
      })
    );
  }

  return winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    defaultMeta: {
      service: 'rentspace-api',
      environment: process.env.NODE_ENV || 'development',
    },
    transports,
    exitOnError: false,
  });
};

export default createLogger;
