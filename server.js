const express = require('express');
const db = require('./config/database');
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());

// Root Route
app.get('/', (req, res) => {
  res.status(200).send('Welcome to the API!');
});

// Route to Fetch All Users
app.get('/users', async (req, res) => {
  try {
    const query = 'SELECT * FROM users';
    const { rows } = await db.query(query);
    res.status(200).json({ users: rows });
  } catch (err) {
    console.error('Error fetching users:', err.message);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Route to Fetch a Single User by ID
app.get('/users/:id', async (req, res) => {
  const userId = parseInt(req.params.id, 10);
  if (isNaN(userId)) {
    return res.status(400).json({ error: 'Invalid user ID' });
  }

  try {
    const query = 'SELECT * FROM users WHERE id = $1';
    const { rows } = await db.query(query, [userId]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json({ user: rows[0] });
  } catch (err) {
    console.error('Error fetching user:', err.message);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// Route to Create a New User
app.post('/create-user', async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email, and password are required' });
  }

  try {
    const query = 'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *';
    const { rows } = await db.query(query, [name, email, password]);
    res.status(201).json({ message: 'User created successfully!', user: rows[0] });
  } catch (err) {
    console.error('Error creating user:', err.message);
    res.status(500).json({ error: 'Failed to create user' });
  }
});

// Route to Update a User by ID
app.put('/users/:id', async (req, res) => {
  const userId = parseInt(req.params.id, 10);
  const { name, email, password } = req.body;

  if (isNaN(userId)) {
    return res.status(400).json({ error: 'Invalid user ID' });
  }

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email, and password are required' });
  }

  try {
    const query = 'UPDATE users SET name = $1, email = $2, password = $3 WHERE id = $4 RETURNING *';
    const { rows } = await db.query(query, [name, email, password, userId]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json({ message: 'User updated successfully!', user: rows[0] });
  } catch (err) {
    console.error('Error updating user:', err.message);
    res.status(500).json({ error: 'Failed to update user' });
  }
});

// Route to Delete a User by ID
app.delete('/users/:id', async (req, res) => {
  const userId = parseInt(req.params.id, 10);

  if (isNaN(userId)) {
    return res.status(400).json({ error: 'Invalid user ID' });
  }

  try {
    const query = 'DELETE FROM users WHERE id = $1 RETURNING *';
    const { rows } = await db.query(query, [userId]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json({ message: 'User deleted successfully!', user: rows[0] });
  } catch (err) {
    console.error('Error deleting user:', err.message);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

// Start the Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});