import React, { useEffect, useState } from 'react';
import './App.css';

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
        const res = await fetch('/.netlify/functions/roster');
        const data = await res.json();

        const allPlayers = data.teams.flatMap(team =>
          team.roster.roster.map(player => ({
            id: player.person.id,
            name: player.person.fullName,
            team: team.abbreviation
          }))
        );

        setPlayerList(allPlayers);
        console.log('Loaded players:', allPlayers);
      } catch (err) {
        console.error('Error loading roster:', err);
      }
    };

    fetchRoster();
  }, []);

  const fetchPlayerData = async (id, setter) => {
    try {
      const statsRes = await fetch(
        `https://corsproxy.io/?https://statsapi.web.nhl.com/api/v1/people/${id}/stats?stats=careerRegularSeason`
      );
      const statsData = await statsRes.json();
      const stat = statsData.stats[0].splits[0].stat;

      const infoRes = await fetch(
        `https://corsproxy.io/?https://statsapi.web.nhl.com/api/v1/people/${id}`
      );
      const infoData = await infoRes.json();
      const person = infoData.people[0];

      const teamAbbr = person.currentTeam?.abbreviation || 'NHL';
      const season = '20242025';

      setter({
        name: person.fullName,
        goals: stat.goals,
        games: stat.games,
        image: `https://assets.nhle.com/mugs/nhl/${season}/${teamAbbr}/${id}.png`
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
    setMatches(matches.slice(0, 8)); // limit suggestions
  };

  const handleSelectPlayer = (player, setter, setQuery, setMatches) => {
    fetchPlayerData(player.id, setter);
    setQuery(player.name);
    setMatches([]);
  };

  return (
    <div className="App">
      <h1>NHL Player Comparison</h1>

      <div style={{ marginBottom: '20px', display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <div style={{ position: 'relative' }}>
          <label>Player 1:</label>
          <input
            type="text"
            value={player1Query}
            placeholder="Type player name"
            onChange={(e) => {
              setPlayer1Query(e.target.value);
              handleSearch(e.target.value, setPlayer1Matches);
            }}
          />
          {player1Matches.length > 0 && (
            <ul style={suggestionBoxStyle}>
              {player1Matches.map(player => (
                <li key={player.id} style={suggestionStyle} onClick={() =>
                  handleSelectPlayer(player, setPlayer1, setPlayer1Query, setPlayer1Matches)
                }>
                  {player.name}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div style={{ position: 'relative' }}>
          <label>Player 2:</label>
          <input
            type="text"
            value={player2Query}
            placeholder="Type player name"
            onChange={(e) => {
              setPlayer2Query(e.target.value);
              handleSearch(e.target.value, setPlayer2Matches);
            }}
          />
          {player2Matches.length > 0 && (
            <ul style={suggestionBoxStyle}>
              {player2Matches.map(player => (
                <li key={player.id} style={suggestionStyle} onClick={() =>
                  handleSelectPlayer(player, setPlayer2, setPlayer2Query, setPlayer2Matches)
                }>
                  {player.name}
                </li>
              ))}
            </ul>
          )}
        </div>
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

// 🔧 Simple inline styles for suggestion dropdowns
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

export default App;
