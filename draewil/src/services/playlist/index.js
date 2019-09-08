const storage = require('../../storage/library');
const dictionaryConverter = require('./converters/dictionary');
const stringUtils = require('../../utils/strings');

let cache;
const songsDictionary = () => {
  if (cache) return cache;
  cache = dictionaryConverter(storage.get());
  return cache;
};

const randomSong = () => {
  const songs = storage.get();
  const song = songs[Math.floor(Math.random() * songs.length)];
  return song;
};

const create = (size) => {
  const playlist = [];
  const letterDictionary = songsDictionary();
  const firstSong = randomSong();
  playlist.push(firstSong);
  while (playlist.length !== size) {
    const lastSong = playlist[playlist.length - 1];
    const endChar = stringUtils.getLastLetterChar(lastSong.name);
    const songs = letterDictionary[endChar];
    if (!songs) {
      throw new Error(`Not found songs, with start char - ${endChar}`);
    }
    const song = songs.find((s) => !playlist.map((i) => i.id).includes(s.id))
                  || songs[0];
    if (!song) {
      throw new Error(`Not found unique song with start char - ${endChar}`);
    }
    playlist.push(song);
  }
  return playlist.map((s) => s.name);
};

module.exports = {
  create,
};
