const config = require('config');
const app = require('./app');
const storage = require('./storage');
const logger = require('./logger');

const listen = () => {
  app().listen(config.port, () => {
    logger.info('Start listening at port', { port: config.port });
  });
};

const run = async () => {
  try {
    await storage.init();
    listen();
  } catch (error) {
    logger.error(error);
    process.exit(1);
  }
};

run();
