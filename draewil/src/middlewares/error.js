const logger = require('../logger');

module.exports = async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    ctx.status = err.statusCode || err.status || 500;
    ctx.body = {
      message: process.env.NODE_ENV !== 'production' ? err.message : 'Internal error',
      errors: err.errors,
    };
    logger.error(err);
  }
};
