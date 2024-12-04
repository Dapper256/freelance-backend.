const { Pool } = require('pg');
require('dotenv').config();

const isProduction = process.env.NODE_ENV === 'production';

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: isProduction
        ? { rejectUnauthorized: false } // Enable SSL for production with relaxed checks
        : false, // Disable SSL for development
});

(async () => {
    try {
        const client = await pool.connect();
        console.log('Database connection established successfully!');
        client.release();
    } catch (error) {
        console.error('Error connecting to the database:', error.message);
        console.error(error.stack);
        process.exit(1); // Exit the process if the connection fails
    }
})();

module.exports = {
    query: (text, params) => pool.query(text, params),
};