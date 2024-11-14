import mongoose from 'mongoose';

const pokemonSchema = new mongoose.Schema({
  name: String,
  types: [String],
  stats: {
    hp: Number,
    attack: Number,
    defense: Number,
    speed: Number,
  },
  imageUrl: String,
});

const Pokemon = mongoose.model('Pokemon', pokemonSchema);

export default Pokemon;
