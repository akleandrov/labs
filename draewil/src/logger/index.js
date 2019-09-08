const {
  createLogger, format, transports, config,
} = require('winston');

const { combine, timestamp, json } = format;

const errorStackFormat = format((info) => {
  if (info instanceof Error) {
    return {
      ...info,
      stack: info.stack,
      message: info.message,
    };
  }
  return info;
});

const trnsprts = [];
if (process.env.NODE_ENV !== 'test') {
  trnsprts.push(new transports.Console({ level: 'debug' }));
}


const logger = createLogger({
  levels: config.syslog.levels,
  format: combine(
    errorStackFormat(),
    timestamp(),
    json(),
  ),
  transports: trnsprts,
});

logger.stream = {
  write(message) {
    logger.info(message.trim());
  },
};

module.exports = logger;
