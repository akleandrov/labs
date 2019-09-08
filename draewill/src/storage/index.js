const config = require('config');
const superagent = require('superagent');
const parseXML = require('xml2js').parseStringPromise;
const library = require('./library');
const logger = require('../logger');

const init = async () => {
  const { libraryUrl } = config;
  const { text: xmlData } = await superagent.get(libraryUrl);
  const parsed = await parseXML(xmlData, {
    mergeAttrs: true,
    explicitArray: false,
    normalizeTags: true,
  });
  library.set(parsed.library);
  logger.info('Success init storage');
};

module.exports = {
  init,
};
