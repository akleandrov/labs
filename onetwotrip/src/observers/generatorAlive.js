const EventEmitter = require('events');
const { promisify } = require('util');
const { timeouts, redis: { keys } } = require('config');
const redisClient = require('../storages/redis');

const redis = redisClient.getNewInstance();
const getAsync = promisify(redis.get).bind(redis);
const observer = new EventEmitter();
let intervalCheckId;

const check = async () => {
  const res = await getAsync(keys.GENERATOR_STATUS);
  if (res === null) {
    observer.emit('GeneratorFail');
  }
};

const start = () => {
  intervalCheckId = setInterval(check, timeouts.interval_check_status);
};

const stop = () => {
  clearInterval(intervalCheckId);
};

const addGenerationFailObserver = (cb) => {
  if (observer) {
    observer.on('GeneratorFail', cb);
  }
};

module.exports = {
  start,
  stop,
  addGenerationFailObserver,
};
