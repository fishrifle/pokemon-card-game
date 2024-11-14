import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

const API_URL = 'http://localhost:3000/api';

const PokemonBattle = () => {
  const [allPokemon, setAllPokemon] = useState([]);
  const [selectedPokemon, setSelectedPokemon] = useState([]);
  const [battleResult, setBattleResult] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPokemon = async () => {
      try {
        const response = await axios.get(`${API_URL}/pokemon`);
        setAllPokemon(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching Pokémon:", error);
        setError("Failed to load Pokémon data.");
        setLoading(false);
      }
    };

    fetchPokemon();
  }, []);

  const selectPokemon = (pokemon) => {
    if (selectedPokemon.includes(pokemon)) {
      setSelectedPokemon(selectedPokemon.filter(p => p !== pokemon));
    } else if (selectedPokemon.length < 2) {
      setSelectedPokemon([...selectedPokemon, pokemon]);
    }
  };

  const startBattle = () => {
    if (selectedPokemon.length !== 2) {
      alert("Select two Pokémon to battle!");
      return;
    }

    const [pokemon1, pokemon2] = selectedPokemon;
    const pokemon1Power = pokemon1.stats.hp + pokemon1.stats.attack + pokemon1.stats.defense;
    const pokemon2Power = pokemon2.stats.hp + pokemon2.stats.attack + pokemon2.stats.defense;

    if (pokemon1Power > pokemon2Power) {
      setBattleResult(`${pokemon1.name} wins!`);
    } else if (pokemon2Power > pokemon1Power) {
      setBattleResult(`${pokemon2.name} wins!`);
    } else {
      setBattleResult("It's a draw!");
    }

    setSelectedPokemon([]);
  };

  const resetBattle = () => {
    setSelectedPokemon([]);
    setBattleResult("");
  };

  return (
    <div>
      <h1>Let The Best Pokemon Win</h1>

      {/* Battle controls and result display */}
      <div className="battle-controls">
        <button className="battle-button" onClick={startBattle} disabled={selectedPokemon.length !== 2}>
          Start Battle
        </button>
        <button className="reset-button" onClick={resetBattle}>
          Reset Battle
        </button>
        {battleResult && <div className="battle-result">{battleResult}</div>}
      </div>

      {loading ? (
        <p>Loading Pokémon...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <div className="pokemon-list">
  {allPokemon.map((pokemon) => {
    const typeClass = `type-${pokemon.type[0].toLowerCase()}`;
    const isSelected = selectedPokemon.includes(pokemon);
    return (
      <div
        key={pokemon._id}
        className={`pokemon-card ${typeClass} ${isSelected ? 'selected' : ''}`}
        onClick={() => selectPokemon(pokemon)}
      >
        <h3>{pokemon.name}</h3>
        <img src={pokemon.sprites.front_default} alt={pokemon.name} />
        <div className="pokemon-stats">
          <p>Types: {pokemon.type.join(', ')}</p> {/* Display types */}
          <p>HP: {pokemon.stats.hp}</p>
          <p>Attack: {pokemon.stats.attack}</p>
          <p>Defense: {pokemon.stats.defense}</p>
          <p>Speed: {pokemon.stats.speed}</p>
        </div>
      </div>
    );
  })}
</div>

      )}
    </div>
  );
};

export default PokemonBattle;
