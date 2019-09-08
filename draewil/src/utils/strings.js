const getStartLetterChar = (text) => {
  const chars = text.split('');
  const start = chars[0].toLowerCase();
  if (!start.match(/[a-zA-Z]/i) && chars.length > 1) {
    return getStartLetterChar(text.substring(1, text.length));
  }
  return start;
};

const getLastLetterChar = (text) => {
  const chars = text.split('');
  const end = chars[chars.length - 1].toLowerCase();
  if (!end.match(/[a-zA-Z]/i) && chars.length > 1) {
    return getLastLetterChar(text.substring(0, text.length - 1));
  }
  return end;
};

module.exports = {
  getLastLetterChar,
  getStartLetterChar,
};
