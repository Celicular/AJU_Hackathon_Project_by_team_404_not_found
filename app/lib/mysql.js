import mysql from 'mysql2/promise';

// Create a connection pool
const pool = mysql.createPool({
  host: process.env.MYSQL_HOST || 'localhost',
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || '',
  database: process.env.MYSQL_DATABASE || 'sync_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Helper function to execute queries
export async function query(sql, params) {
  const [results] = await pool.execute(sql, params);
  return results;
}

// Helper function to get a single row
export async function getOne(sql, params) {
  const rows = await query(sql, params);
  return rows[0];
}

// Initialize database tables if they don't exist
export async function initDatabase() {
  try {
    // Create users table if it doesn't exist
    await query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        enrollment VARCHAR(10) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        course VARCHAR(255) NOT NULL,
        rollNo VARCHAR(20) NOT NULL,
        startYear INT NOT NULL,
        endYear INT NOT NULL,
        batch VARCHAR(10) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create Menu table if it doesn't exist
    await query(`
      CREATE TABLE IF NOT EXISTS Menu (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        price DECIMAL(10,2) NOT NULL,
        isAvailable BOOLEAN DEFAULT TRUE,
        category VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create SalesReport table if it doesn't exist
    await query(`
      CREATE TABLE IF NOT EXISTS SalesReport (
        id INT AUTO_INCREMENT PRIMARY KEY,
        itemId INT NOT NULL,
        itemName VARCHAR(255) NOT NULL,
        quantity INT NOT NULL,
        totalPrice DECIMAL(10,2) NOT NULL,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (itemId) REFERENCES Menu(id)
      )
    `);
    
    console.log('Database tables initialized successfully');
    return true;
  } catch (error) {
    console.error('Error initializing database:', error);
    return false;
  }
}

// Function to check if there are any users
export async function hasUsers() {
  const result = await query('SELECT COUNT(*) as count FROM users');
  return result[0].count > 0;
}

export default {
  query,
  getOne,
  initDatabase,
  hasUsers
}; 