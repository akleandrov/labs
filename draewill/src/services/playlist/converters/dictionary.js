/* eslint-disable no-param-reassign */
const stringUtils = require('../../../utils/strings');

const convert = (library) => library.reduce((linked, song) => {
  const start = stringUtils.getStartLetterChar(song.name);
  if (!start) return linked;
  if (!linked[start]) {
    linked[start] = [song];
  } else {
    linked[start].push(song);
  }
  return linked;
}, { });

module.exports = convert;
