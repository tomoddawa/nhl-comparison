import fetch from 'node-fetch';

export async function handler(event, context) {
  try {
    const res = await fetch('https://statsapi.web.nhl.com/api/v1/teams?expand=team.roster');
    const data = await res.json();

    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Failed to fetch roster', error: error.message }),
    };
  }
}