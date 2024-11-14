import mongoose from 'mongoose';

const battleSchema = new mongoose.Schema({
  pokemon1: String,
  pokemon2: String,
  winner: String,
  battleLog: [String],
});

const Battle = mongoose.model('Battle', battleSchema);

export default Battle;
