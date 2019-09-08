const { timeouts, messageTypes, redis: { channels } } = require('config');
const uuidv4 = require('uuid/v4');

const client = require('./roles/client');
const generator = require('./roles/generator');
const redisClient = require('./storages/redis');
const { limitTimeProcess } = require('./utils/timers');
const generatorObserver = require('./observers/generatorAlive');
const logger = require('./logger');

let sub;
let pub;
let isElection = false;
const app = {};

const createMessage = (type) => JSON.stringify({
  id: app.Id,
  ttl: app.ttl,
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
  logger.debug('Start transform to generator app = %s', app.Id);
  disableClient();
  enableGenerator();
  pub.publish(channels.LEADER_ELECTION_CHANNEL, createMessage(messageTypes.ELECTION_COMPLETE));
};

const request = async () => {
  pub.publish(channels.LEADER_ELECTION_CHANNEL, createMessage(messageTypes.REQUEST));
  try {
    await limitTimeProcess(
      getMessage(messageTypes.RESPONSE),
      timeouts.wait_alive_response,
    );
    try {
      await limitTimeProcess(
        getMessage(messageTypes.ELECTION_COMPLETE),
        timeouts.wait_election_complete,
      );
      isElection = false;
      enableClient();
    } catch (error) {
      logger.debug(`app ${app.Id} not receive electionComplete message`);
      await request();
    }
  } catch (error) {
    logger.debug(`app ${app.Id} not receive response message`);
    transformToGenerator();
  }
};

const electionMessageHandler = async (channel, message) => {
  const req = JSON.parse(message);
  if (req.id === app.Id) {
    return;
  }
  switch (req.type) {
    case messageTypes.REQUEST: {
      if (req.ttl < app.ttl) {
        pub.publish(channels.LEADER_ELECTION_CHANNEL, createMessage(messageTypes.RESPONSE));
      }
      break;
    }
    case messageTypes.ELECTION_COMPLETE:
      if (req.ttl < app.ttl) {
        disableGenerator();
        await request();
      }
      break;
    default:
  }
};

const failGeneratorHandler = async () => {
  if (isElection) {
    return;
  }
  logger.debug(`app ${app.Id} found Generator dead`);
  generatorObserver.stop();
  isElection = true;
  await request();
};

const init = () => {
  sub = redisClient.getNewInstance();
  pub = redisClient.getNewInstance();
  app.Id = uuidv4();
  app.ttl = Date.now();
  logger.debug(`Application started with id ${app.Id}`);
  sub.subscribe(channels.LEADER_ELECTION_CHANNEL);
  generatorObserver.addGenerationFailObserver(failGeneratorHandler);
  sub.on('message', electionMessageHandler);
  enableClient();
};

module.exports = {
  init,
};
