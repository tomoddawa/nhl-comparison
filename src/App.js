import React, { useState } from 'react';
import './App.css';

function App() {
  const [player1Id, setPlayer1Id] = useState(8471214); // Ovechkin
  const [player2Id, setPlayer2Id] = useState(8478402); // McDavid
  const [player1, setPlayer1] = useState(null);
  const [player2, setPlayer2] = useState(null);

  const fetchMockData = (id) => {
    const mockData = {
      8471214: {
        name: "Alexander Ovechkin",
        goals: 853,
        games: 1435,
        image: "https://assets.nhle.com/mugs/nhl/20242025/WSH/8471214.png"
      },
      8478402: {
        name: "Connor McDavid",
        goals: 334,
        games: 645,
        image: "https://assets.nhle.com/mugs/nhl/20242025/EDM/8478402.png"
      },
      8479318: {
        name: "Auston Matthews",
        goals: 368,
        games: 562,
        image: "https://assets.nhle.com/mugs/nhl/20242025/TOR/8479318.png"
      },
      8471675: {
        name: "Sidney Crosby",
        goals: 591,
        games: 1230,
        image: "https://assets.nhle.com/mugs/nhl/20242025/PIT/8471675.png"
      }
    };

    return mockData[id] || null;
  };

  const loadPlayers = () => {
    const p1 = fetchMockData(player1Id);
    const p2 = fetchMockData(player2Id);
    setPlayer1(p1);
    setPlayer2(p2);

    if (!p1 || !p2) alert("One or both player IDs have no mock data yet.");
  };

  return (
    <div className="App">
      <h1>NHL Player Comparison</h1>

      <div style={{ marginBottom: '20px' }}>
        <div>
          <label>Player 1 ID: </label>
          <input
            type="number"
            value={player1Id}
            onChange={(e) => setPlayer1Id(e.target.value)}
          />
        </div>
        <div>
          <label>Player 2 ID: </label>
          <input
            type="number"
            value={player2Id}
            onChange={(e) => setPlayer2Id(e.target.value)}
          />
        </div>
        <button onClick={loadPlayers}>Compare Players</button>
      </div>

<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
        {player1 && (
          <div className="player-card">
            <img src={player1.image} alt={player1.name} className="player-photo" />
            <h2>{player1.name}</h2>
            <p>Goals: {player1.goals}</p>
            <p>Games Played: {player1.games}</p>
          </div>
        )}
        {player2 && (
          <div className="player-card">
            <img src={player2.image} alt={player2.name} className="player-photo" />
            <h2>{player2.name}</h2>
            <p>Goals: {player2.goals}</p>
            <p>Games Played: {player2.games}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
