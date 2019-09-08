const Koa = require('koa');

const config = require('config');
const err = require('./middlewares/error');
const router = require('./modules');
const logger = require('./logger');

const createApp = () => {
  const app = new Koa();
  app.use(err);
  app.use(router.allowedMethods());
  app.use(router.routes());

  return app;
};

if (!module.parent) {
  createApp().listen(config.port, () => {
    logger.debug(`server running at ${config.port}`);
  });
}

module.exports = createApp;
