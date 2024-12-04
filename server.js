const express = require('express');
const db = require('./config/database'); // Use `database.js`
require('dotenv').config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

// Test Route
app.get('/', (req, res) => {
  res.send('Welcome to the API!');
});

// Example Route to Fetch Users
app.get('/users', async (req, res) => {
  try {
    const query = 'SELECT * FROM users'; // Replace `users` with your table name
    const { rows } = await db.query(query);
    res.status(200).json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Start the Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});