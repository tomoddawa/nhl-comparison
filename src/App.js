import React, { useEffect, useState } from 'react';
import './App.css';

const suggestionBoxStyle = {
  position: 'absolute',
  backgroundColor: '#fff',
  border: '1px solid #ccc',
  borderRadius: '4px',
  width: '200px',
  maxHeight: '150px',
  overflowY: 'auto',
  marginTop: '4px',
  zIndex: 10,
  padding: 0,
  listStyle: 'none'
};

const suggestionStyle = {
  padding: '8px',
  cursor: 'pointer',
  borderBottom: '1px solid #eee'
};

function App() {
  const [playerList, setPlayerList] = useState([]);
  const [player1Query, setPlayer1Query] = useState('');
  const [player2Query, setPlayer2Query] = useState('');
  const [player1Matches, setPlayer1Matches] = useState([]);
  const [player2Matches, setPlayer2Matches] = useState([]);
  const [player1, setPlayer1] = useState(null);
  const [player2, setPlayer2] = useState(null);

  useEffect(() => {
    const fetchRoster = async () => {
      try {
        const res = await fetch('/roster.json');
        const data = await res.json();

        const allPlayers = data.teams.flatMap(team =>
          team.roster.roster.map(player => ({
            id: player.person.id,
            name: player.person.fullName
          }))
        );

        setPlayerList(allPlayers);
      } catch (err) {
        console.error('Error loading roster:', err);
      }
    };

    fetchRoster();
  }, []);

  const fetchPlayerData = async (id, setter) => {
    try {
      const res = await fetch(`/player-stats.json?t=${Date.now()}`);
      const data = await res.json();

      const player = data[id];
      if (!player) throw new Error('Player not found');

      setter({
        name: player.name,
        goals: player.goals,
        assists: player.assists,
        points: player.points,
        games: player.games,
        image: player.image
      });
    } catch (err) {
      console.error('Error loading player data:', err);
      setter(null);
    }
  };

  const handleSearch = (query, setMatches) => {
    const matches = playerList.filter(player =>
      player.name.toLowerCase().includes(query.toLowerCase())
    );
    setMatches(matches.slice(0, 8));
  };

  const handleSelectPlayer = (player, setter, setQuery, setMatches) => {
    fetchPlayerData(player.id, setter);
    setQuery(player.name);
    setMatches([]);
  };

  return (
    <div className="App">
      <div className="app-header">
  <img src="/logo.png" alt="Oddawa Logo" className="logo" />
  <h1>Oddawa's NHL Player Comparison</h1>
</div>
      <div style={{ marginBottom: '20px', display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <SearchInput
          label="Player 1"
          query={player1Query}
          matches={player1Matches}
          setQuery={setPlayer1Query}
          setMatches={setPlayer1Matches}
          handleSearch={handleSearch}
          handleSelect={player => handleSelectPlayer(player, setPlayer1, setPlayer1Query, setPlayer1Matches)}
        />
        <SearchInput
          label="Player 2"
          query={player2Query}
          matches={player2Matches}
          setQuery={setPlayer2Query}
          setMatches={setPlayer2Matches}
          handleSearch={handleSearch}
          handleSelect={player => handleSelectPlayer(player, setPlayer2, setPlayer2Query, setPlayer2Matches)}
        />
      </div>
      <div className="player-card-container">
  {player1 && <PlayerCard player={player1} opponent={player2} />}
  {player2 && <PlayerCard player={player2} opponent={player1} />}
</div>
    </div>
  );
}

const SearchInput = ({ label, query, matches, setQuery, setMatches, handleSearch, handleSelect }) => (
  <div style={{ position: 'relative' }}>
    <label>{label}:</label>
    <input
      type="text"
      value={query}
      placeholder="Type player name"
      onChange={(e) => {
        setQuery(e.target.value);
        handleSearch(e.target.value, setMatches);
      }}
    />
    {matches.length > 0 && (
      <ul style={suggestionBoxStyle}>
        {matches.map(player => (
          <li key={player.id} style={suggestionStyle} onClick={() => handleSelect(player)}>
            {player.name}
          </li>
        ))}
      </ul>
    )}
  </div>
);

const PlayerCard = ({ player, opponent }) => (
  <div className="player-card">
    <img src={player.image} alt={player.name} className="player-photo" />
    <h2>{player.name}</h2>
    <StatBar
  label="Goals"
  value={player.goals}
  max={Math.max(player.goals, opponent?.goals || 0)}
  highlight={player.goals > (opponent?.goals || 0)}
/>
<StatBar
  label="Assists"
  value={player.assists}
  max={Math.max(player.assists, opponent?.assists || 0)}
  highlight={player.assists > (opponent?.assists || 0)}
/>
<StatBar
  label="Points"
  value={player.points}
  max={Math.max(player.points, opponent?.points || 0)}
  highlight={player.points > (opponent?.points || 0)}
/>
<StatBar
  label="Games Played"
  value={player.games}
  max={Math.max(player.games, opponent?.games || 0)}
  highlight={player.games > (opponent?.games || 0)}
/>
      <div style={{ marginTop: '20px' }}>
  <h4 style={{ marginBottom: '8px' }}>Per Game</h4>
  <StatBar
    label="Goals/Game"
    value={player.goals / player.games}
    max={Math.max(player.goals / player.games, opponent?.goals / opponent?.games || 0)}
    highlight={(player.goals / player.games) > (opponent?.goals / opponent?.games || 0)}
  />
  <StatBar
    label="Assists/Game"
    value={player.assists / player.games}
    max={Math.max(player.assists / player.games, opponent?.assists / opponent?.games || 0)}
    highlight={(player.assists / player.games) > (opponent?.assists / opponent?.games || 0)}
  />
  <StatBar
    label="Points/Game"
    value={player.points / player.games}
    max={Math.max(player.points / player.games, opponent?.points / opponent?.games || 0)}
    highlight={(player.points / player.games) > (opponent?.points / opponent?.games || 0)}
  />
</div>
  </div>
  
);

const StatBar = ({ label, value, max, avg, highlight = false }) => {
  const percent = Math.round((value / max) * 100);
  const barColor = highlight ? '#28a745' : '#0077cc';
  const textColor = highlight ? '#28a745' : '#111';
  const glow = highlight ? '0 0 0.5px #28a745aa' : 'none';

  return (
    <div style={{ margin: '10px 0', textAlign: 'left' }}>
      <div style={{ fontWeight: 500, color: textColor, textShadow: glow }}>
        {label}: {Number.isInteger(value) ? value : value.toFixed(2)}
      </div>
      <div style={{ height: '10px', background: '#e0e0e0', borderRadius: '5px', marginTop: '4px', overflow: 'hidden' }}>
        <div style={{ width: `${percent}%`, background: barColor, height: '100%', borderRadius: '5px', boxShadow: glow }}></div>
      </div>
      {avg !== undefined && (
        <div style={{ fontSize: '0.85rem', color: '#555', marginTop: '4px' }}>
          {avg.toFixed(2)} per game
        </div>
      )}
    </div>
  );
};

export default App;

