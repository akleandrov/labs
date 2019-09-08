const randomstring = require('randomstring');
const { timeouts, redis: { keys, lists } } = require('config');
const redisClient = require('../storages/redis');

const redis = redisClient.getNewInstance();
let messagesIntervalId;
let statusIntervalId;

function generateMessages() {
  const message = randomstring.generate();
  redis.rpush(lists.messages, message);
}

function setStatus() {
  redis.setex(keys.GENERATOR_STATUS, 5, 'enabled');
}
function start() {
  messagesIntervalId = setInterval(generateMessages, timeouts.generate_message);
  statusIntervalId = setInterval(setStatus, timeouts.set_generator_status);
}
function stop() {
  clearInterval(messagesIntervalId);
  clearInterval(statusIntervalId);
}


module.exports = {
  start,
  stop,
};
