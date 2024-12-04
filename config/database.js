const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false, // Required for Heroku PostgreSQL
    },
});

// Check the database connection
pool.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err.stack);
        process.exit(1); // Exit process if database connection fails
    } else {
        console.log('Database connection established successfully!');
    }
});

module.exports = {
    query: (text, params) => pool.query(text, params), // Query helper
};