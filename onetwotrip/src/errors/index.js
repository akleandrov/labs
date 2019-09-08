const { promisify } = require('util');
const redisClient = require('../storages/redis');

const redis = redisClient.getNewInstance();
const lrangeAsync = promisify(redis.lrange).bind(redis);
const rpopAsync = promisify(redis.rpop).bind(redis);


const getErrors = async () => {
  const errors = await lrangeAsync(redisClient.lists.errors, 0, -1);
  const pops = [];
  for (let i = 0; i < errors.length; i += 1) {
    pops.push(rpopAsync(redisClient.lists.errors));
  }
  await Promise.all(pops);
  if (errors.length === 0) {
    return 'Not errors';
  }
  return errors.join('\n');
};

module.exports = {
  getErrors,
};
