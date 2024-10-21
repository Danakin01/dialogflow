const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');

const app = express();
app.use(bodyParser.json());

// MySQL database connection
const db = mysql.createConnection({
  host: '134.209.21.88',
  user: 'interns',
  password: 'Interns@$#2024',
  database: 'vasdigital_summary',
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL');
});

// Webhook route for Dialogflow
app.post('/webhook', (req, res) => {
  const intentName = req.body.queryResult.intent.displayName;
  
  // Example: Fetching data for a specific intent
  if (intentName === 'GetUserInfo') {
    const userId = req.body.queryResult.parameters.userId;
    
    // Query the MySQL database
    const query = 'SELECT * FROM users WHERE id = ?';
    db.query(query, [userId], (err, results) => {
      if (err) {
        return res.json({ fulfillmentText: 'Error querying the database' });
      }
      if (results.length > 0) {
        const user = results[0];
        res.json({ fulfillmentText: `User ${user.name} has ${user.points} points.` });
      } else {
        res.json({ fulfillmentText: 'User not found.' });
      }
    });
  } else {
    res.json({ fulfillmentText: 'Intent not recognized.' });
  }
});

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
