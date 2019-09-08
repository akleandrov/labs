/* eslint-disable no-param-reassign */
let library;

const convert = (data) => {
  const flatSongs = data.artist
    .reduce((songs, artist) => {
      const rawSongs = Array.isArray(artist.song) ? artist.song : [artist.song];
      const flat = rawSongs.map((song) => ({
        artist: artist.name,
        ...song,
        duration: Number.parseInt(song.duration, 10),
      }));
      songs = songs.concat(flat);
      return songs;
    }, []);
  return flatSongs;
};

const set = (data) => {
  library = convert(data);
};

const get = () => library;

module.exports = {
  set,
  get,
};
