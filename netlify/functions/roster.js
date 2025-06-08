const fetch = require('node-fetch'); // <- now guaranteed to work with v2

exports.handler = async function (event, context) {
  try {
    const res = await fetch('https://statsapi.web.nhl.com/api/v1/teams?expand=team.roster');
    const data = await res.json();

    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (error) {
    console.error('Function error:', error.message);

    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Failed to fetch roster', error: error.message }),
    };
  }
};