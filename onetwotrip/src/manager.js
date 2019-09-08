const { timeouts, messageTypes, redis: { channels } } = require('config');
const uuidv4 = require('uuid/v4');

const client = require('./roles/client');
const generator = require('./roles/generator');
const redisClient = require('./storages/redis');
const { limitTimeProcess } = require('./utils/timers');
const generatorObserver = require('./observers/generatorAlive');
const logger = require('./logger');

let sub;// = redisClient.getNewInstance();
let pub;// = redisClient.getNewInstance();
let isElection = false;
const app = {};

const createMessage = (type) => JSON.stringify({
  id: app.Id,
  type,
});

const getMessage = (type) => () => new Promise((resolve) => {
  sub.on('message', (channel, message) => {
    const mess = JSON.parse(message);
    if (mess.type === type && mess.id !== app.Id) {
      resolve(message);
    }
  });
});

const enableGenerator = () => {
  logger.debug(`App ${app.Id} Start generator mode`);
  generator.start();
  pub.set('generatorId', app.Id);
};

const disableGenerator = () => {
  logger.debug(`App ${app.Id} Stop generator mode`);
  generator.stop();
};

const enableClient = () => {
  logger.debug(`App ${app.Id} Start client mode`);
  generatorObserver.start();
  client.start();
};
const disableClient = () => {
  logger.debug(`App ${app.Id} Stop client mode`);
  client.stop();
};

const transformToGenerator = () => {
  logger.debug('Start transoform to generator app = %s', app.Id);
  disableClient();
  enableGenerator();
  pub.publish(channels.LEADER_ELECTION_CHANNEL, createMessage(messageTypes.ELECTION_COMPLETE));
};

function request() {
  pub.publish(channels.LEADER_ELECTION_CHANNEL, createMessage(messageTypes.REQUEST));
  limitTimeProcess(getMessage(messageTypes.RESPONSE), timeouts.wait_alive_response)
    .then(() => {
      limitTimeProcess(getMessage(messageTypes.ELECTION_COMPLETE), timeouts.wait_election_complete)
        .then(() => {
          isElection = false;
          enableClient();
        })
        .catch(() => {
          logger.debug(`app ${app.Id} not receive electionComplete message`);
          request();
        });
    })
    .catch(() => {
      logger.debug(`app ${app.Id} not receive response message`);
      transformToGenerator();
    });
}

function handlerMessageFromAlive(channel, message) {
  const req = JSON.parse(message);
  if (req.id === app.Id) {
    return;
  }
  logger.debug(`app ${app.Id} handlerMessageFromAlive - ${message}`);
  switch (req.type) {
    case messageTypes.REQUEST: {
      if (req.id < app.Id) {
        pub.publish(channels.LEADER_ELECTION_CHANNEL, createMessage(messageTypes.RESPONSE));
      }
      break;
    }
    case messageTypes.ELECTION_COMPLETE:
      if (req.id < app.Id) {
        disableGenerator();
        request();
      }
      break;
    default:
  }
}
function failGeneratorHandler() {
  if (isElection) {
    return;
  }
  logger.debug(`app ${app.Id} found Generator dead`);
  generatorObserver.stop();
  isElection = true;
  request();
}

const init = () => {
  sub = redisClient.getNewInstance();
  pub = redisClient.getNewInstance();
  app.Id = uuidv4();
  logger.debug(`Application started with id ${app.Id}`);
  sub.subscribe(channels.LEADER_ELECTION_CHANNEL);
  generatorObserver.addGenerationFailObserver(failGeneratorHandler);
  sub.on('message', handlerMessageFromAlive);
  enableClient();
};

module.exports = {
  init,
};
