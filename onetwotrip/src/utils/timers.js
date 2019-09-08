const logger = require('../logger');

const time = (ms) => new Promise((resolve) => {
  setTimeout(() => {
    resolve(null);
  }, ms);
});

const limitTimeProcess = (processing, ms) => new Promise((resolve, reject) => {
  Promise.race([processing(), time(ms)])
    .then((res) => {
      if (res != null) {
        resolve(res);
      } else {
        reject(res);
      }
    })
    .catch((err) => logger.error(err));
});

module.exports = {
  limitTimeProcess,
};
