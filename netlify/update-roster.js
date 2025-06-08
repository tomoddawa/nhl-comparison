const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');

exports.handler = async function () {
  try {
    const response = await fetch('https://statsapi.web.nhl.com/api/v1/teams?expand=team.roster');
    const data = await response.json();

    const filePath = path.join(__dirname, '../../public/roster.json');
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Roster updated successfully!' }),
    };
  } catch (error) {
    console.error('Error updating roster:', error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Roster update failed.', error: error.message }),
    };
  }
};