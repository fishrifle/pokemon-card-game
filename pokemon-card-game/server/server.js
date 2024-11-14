require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI, {
  
}).then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("MongoDB connection error:", error));

const pokemonSchema = new mongoose.Schema({
  name: String,
  type: [String],
  stats: {
    hp: Number,
    attack: Number,
    defense: Number,
    speed: Number,
  },
  sprites: {
    front_default: String,
  },
});

const Pokemon = mongoose.model('Pokemon', pokemonSchema);

const fetchAndSaveAllPokemon = async () => {
  try {
    const response = await axios.get("https://pokeapi.co/api/v2/pokemon/?limit=151");
    const requests = response.data.results.map(pokemon => axios.get(pokemon.url));
    const pokemonResponses = await Promise.all(requests);

    const pokemonData = pokemonResponses.map(res => ({
      name: res.data.name,
      type: res.data.types.map(typeInfo => typeInfo.type.name), // Store types as an array
      stats: {
        hp: res.data.stats.find(stat => stat.stat.name === 'hp')?.base_stat || 0,
        attack: res.data.stats.find(stat => stat.stat.name === 'attack')?.base_stat || 0,
        defense: res.data.stats.find(stat => stat.stat.name === 'defense')?.base_stat || 0,
        speed: res.data.stats.find(stat => stat.stat.name === 'speed')?.base_stat || 0,
      },
      sprites: {
        front_default: res.data.sprites.front_default,
      },
    }));

    // Insert only if the Pokémon doesn't already exist in the database
    for (const pokemon of pokemonData) {
      await Pokemon.updateOne(
        { name: pokemon.name },
        { $setOnInsert: pokemon },
        { upsert: true } // Insert only if not already in the database
      );
    }

    console.log("First 151 unique Pokémon saved successfully.");
  } catch (error) {
    console.error("Error saving Pokémon data:", error);
  }
};


// Uncomment this line if you want to run the fetch and save function once
 fetchAndSaveAllPokemon();

app.get('/api/pokemon', async (req, res) => {
  try {
    const pokemons = await Pokemon.find();
    res.json(pokemons);
  } catch (error) {
    console.error("Error fetching Pokémon:", error);
    res.status(500).send("Failed to fetch Pokémon.");
  }
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
