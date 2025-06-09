const fs = require('fs');
const fetch = require('node-fetch');

const PROXY = 'https://corsproxy.io/?';
const TEAM_URL = PROXY + 'https://statsapi.web.nhl.com/api/v1/teams?expand=team.roster';
const STATS_BASE = PROXY + 'https://statsapi.web.nhl.com/api/v1/people';

async function fetchRoster() {
  const res = await fetch(TEAM_URL);
  const data = await res.json();
  const allPlayers = [];

  data.teams.forEach(team => {
    const teamAbbr = team.abbreviation;
    team.roster.roster.forEach(player => {
      allPlayers.push({
        id: player.person.id,
        name: player.person.fullName,
        team: teamAbbr
      });
    });
  });

  return allPlayers;
}

async function fetchStatsForPlayer(player) {
  try {
    const res = await fetch(`${STATS_BASE}/${player.id}/stats?stats=careerRegularSeason`);
    const statData = await res.json();
    const splits = statData.stats[0].splits;
    const stat = splits.length > 0 ? splits[0].stat : {};

    return {
      name: player.name,
      team: player.team,
      goals: stat.goals || 0,
      assists: stat.assists || 0,
      points: (stat.goals || 0) + (stat.assists || 0),
      games: stat.games || 0,
      image: `https://assets.nhle.com/mugs/nhl/20242025/${player.team}/${player.id}.png`
    };
  } catch (err) {
    console.error(`❌ Failed for ${player.name}:`, err.message);
    return null;
  }
}

async function generateFile() {
  console.log('📡 Fetching NHL rosters via proxy...');
  const players = await fetchRoster();

  console.log(`🎯 Found ${players.length} players. Fetching stats...`);
  const output = {};

  for (let i = 0; i < players.length; i++) {
    const player = players[i];
    const stats = await fetchStatsForPlayer(player);
    if (stats) {
      output[player.id] = stats;
    }

    if ((i + 1) % 25 === 0) {
      console.log(`Progress: ${i + 1}/${players.length}`);
    }
  }

  fs.writeFileSync('player-stats.json', JSON.stringify(output, null, 2));
  console.log('✅ Done! player-stats.json saved.');
}

generateFile();