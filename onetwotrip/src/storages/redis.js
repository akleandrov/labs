const Redis = require('redis');
const { redis: { connection } } = require('config');

module.exports = {
  getNewInstance() {
    return Redis.createClient(connection);
  },
};
