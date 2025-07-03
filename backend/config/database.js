const mysql = require('mysql2');
const sqlite3 = require('sqlite3').verbose();
const dotenv = require('dotenv');

dotenv.config();

// Database connection instance
let db = null;

async function createDatabaseConnection() {
  try {
    // Try MySQL first
    const pool = mysql.createPool({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'ecommerce',
      port: process.env.DB_PORT || 3306,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      acquireTimeout: 60000,
      timeout: 60000
    });

    // Test MySQL connection
    const testPool = pool.promise();
    await testPool.execute('SELECT 1');
    console.log('✅ MySQL Database connected successfully');
    return testPool;
  } catch (error) {
    console.log('❌ MySQL connection failed, falling back to SQLite:', error.message);
    
    // Fall back to SQLite
    const sqliteDb = new sqlite3.Database('./database.sqlite');
    
    // Create a promise-based wrapper for SQLite
    const sqliteWrapper = {
      execute: (query, params = []) => {
        return new Promise((resolve, reject) => {
          if (query.trim().toUpperCase().startsWith('SELECT')) {
            sqliteDb.all(query, params, (err, rows) => {
              if (err) reject(err);
              else resolve([rows]);
            });
          } else {
            sqliteDb.run(query, params, function(err) {
              if (err) reject(err);
              else resolve([{ affectedRows: this.changes, insertId: this.lastID }]);
            });
          }
        });
      },
      query: (query, params = []) => {
        return new Promise((resolve, reject) => {
          sqliteDb.all(query, params, (err, rows) => {
            if (err) reject(err);
            else resolve([rows]);
          });
        });
      }
    };
    
    console.log('✅ SQLite Database connected successfully');
    await setupSQLiteTables(sqliteWrapper);
    return sqliteWrapper;
  }
}

async function setupSQLiteTables(db) {
  console.log('🔧 Setting up SQLite tables...');
  
  // Create tables for SQLite (adapted from MySQL schema)
  const tables = [
    `CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      first_name TEXT,
      last_name TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`,
    
    `CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      price REAL NOT NULL,
      original_price REAL,
      image TEXT,
      rating REAL DEFAULT 0,
      reviews INTEGER DEFAULT 0,
      category TEXT,
      in_stock BOOLEAN DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`,
    
    `CREATE TABLE IF NOT EXISTS cart (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      product_id INTEGER NOT NULL,
      quantity INTEGER NOT NULL DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
    )`,
    
    `CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      total_amount REAL NOT NULL,
      status TEXT DEFAULT 'pending',
      shipping_address TEXT,
      billing_address TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )`,
    
    `CREATE TABLE IF NOT EXISTS contact_messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      full_name TEXT NOT NULL,
      email TEXT NOT NULL,
      subject TEXT NOT NULL,
      message TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`
  ];
  
  for (const table of tables) {
    await db.execute(table);
  }
  
  // Insert sample data if products table is empty
  const [existing] = await db.execute('SELECT COUNT(*) as count FROM products');
  if (existing[0].count === 0) {
    console.log('📊 Inserting sample data...');
    const sampleProducts = [
      [1, 'Premium Wireless Headphones', 299.99, 399.99, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop', 4.8, 124, 'Electronics', 1, 'High-quality wireless headphones with noise cancellation'],
      [2, 'Smart Fitness Watch', 199.99, null, 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop', 4.6, 89, 'Electronics', 1, 'Track your fitness goals with this advanced smartwatch'],
      [3, 'Professional Camera Lens', 849.99, null, 'https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=500&h=500&fit=crop', 4.9, 67, 'Photography', 1, 'Professional grade camera lens for stunning photography'],
      [4, 'Ergonomic Office Chair', 449.99, 599.99, 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500&h=500&fit=crop', 4.7, 156, 'Furniture', 1, 'Comfortable ergonomic office chair for long work sessions'],
      [5, 'Wireless Gaming Mouse', 79.99, null, 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&h=500&fit=crop', 4.5, 203, 'Electronics', 1, 'High-precision wireless gaming mouse with RGB lighting'],
      [6, 'Minimalist Desk Lamp', 89.99, null, 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=500&fit=crop', 4.4, 78, 'Home', 0, 'Modern minimalist LED desk lamp with adjustable brightness']
    ];
    
    for (const product of sampleProducts) {
      await db.execute(
        'INSERT INTO products (id, name, price, original_price, image, rating, reviews, category, in_stock, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        product
      );
    }
  }
  
  console.log('✅ SQLite setup completed');
}

// Initialize the database connection
createDatabaseConnection().then(connection => {
  db = connection;
}).catch(console.error);

module.exports = {
  execute: async (query, params) => {
    if (!db) {
      throw new Error('Database not initialized');
    }
    return await db.execute(query, params);
  },
  query: async (query, params) => {
    if (!db) {
      throw new Error('Database not initialized');
    }
    return await db.query ? db.query(query, params) : db.execute(query, params);
  }
};
