import mongoose from 'mongoose';

const songSchema = new mongoose.Schema({
  album_name: String,
  ep: String,
  album_release: String,
  track_number: Number,
  track_name: String,
  artist: String,
  featuring: String,
  bonus_track: String,
  promotional_release: String,
  single_release: String,
  track_release: String,
  duration: String,
  lyric: String
});

const Song = mongoose.model('Song', songSchema, 'taylor_songs_complete');

export default Song;
