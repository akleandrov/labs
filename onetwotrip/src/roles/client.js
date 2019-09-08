const { promisify } = require('util');
const { redis: { lists } } = require('config');
const redisClient = require('../storages/redis');

const redis = redisClient.getNewInstance();
const brpopAsync = promisify(redis.brpop).bind(redis);
let checkIntervalId;

const processMessage = async () => {
  const data = await brpopAsync(lists.messages, 2);
  if (data === null) {
    return;
  }
  const error = Math.random() > 0.95;
  if (error) {
    redis.rpush(lists.errors, data[1]);
  }
};

const start = () => {
  checkIntervalId = setInterval(processMessage, 500);
};

const stop = () => {
  clearInterval(checkIntervalId);
};

module.exports = {
  stop,
  start,
};
