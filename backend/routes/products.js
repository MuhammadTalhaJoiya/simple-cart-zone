
const express = require('express');
const db = require('../config/database');

const router = express.Router();

// Get all products with filtering and sorting
router.get('/', async (req, res) => {
  try {
    console.log('GET /api/products - Request received with query:', req.query);
    
    const { 
      category, 
      minPrice, 
      maxPrice, 
      search, 
      sortBy = 'name', 
      order = 'ASC',
      page = 1,
      limit = 50
    } = req.query;

    let query = 'SELECT * FROM products WHERE 1=1';
    const params = [];

    console.log('Starting to build query. Base query:', query);

    // Apply filters
    if (category && category !== 'All') {
      query += ' AND category = ?';
      params.push(category);
      console.log('Added category filter:', category);
    }

    if (minPrice) {
      query += ' AND price >= ?';
      params.push(parseFloat(minPrice));
      console.log('Added minPrice filter:', minPrice);
    }

    if (maxPrice) {
      query += ' AND price <= ?';
      params.push(parseFloat(maxPrice));
      console.log('Added maxPrice filter:', maxPrice);
    }

    if (search) {
      query += ' AND (name LIKE ? OR description LIKE ? OR category LIKE ?)';
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
      console.log('Added search filter:', search);
    }

    // Apply sorting
    const validSortFields = ['name', 'price', 'rating', 'created_at'];
    let sortField = 'name';
    let sortOrder = 'ASC';

    if (validSortFields.includes(sortBy)) {
      sortField = sortBy;
    }

    // Handle special cases for sorting
    if (sortBy === 'price_desc') {
      sortField = 'price';
      sortOrder = 'DESC';
    } else if (sortBy === 'price') {
      sortField = 'price';
      sortOrder = 'ASC';
    } else if (order && ['ASC', 'DESC'].includes(order.toUpperCase())) {
      sortOrder = order.toUpperCase();
    }

    query += ` ORDER BY ${sortField} ${sortOrder}`;
    console.log('Added sorting:', sortField, sortOrder);

    // Apply pagination
    const offset = (parseInt(page) - 1) * parseInt(limit);
    query += ' LIMIT ? OFFSET ?';
    params.push(parseInt(limit), offset);

    console.log('Final query:', query);
    console.log('Query params:', params);

    // Check if database connection exists
    if (!db) {
      console.error('Database connection is null or undefined');
      return res.status(500).json({ error: 'Database connection error' });
    }

    console.log('About to execute query...');
    const [products] = await db.execute(query, params);
    console.log('Query executed successfully. Products found:', products.length);

    // Get total count for pagination
    let countQuery = 'SELECT COUNT(*) as total FROM products WHERE 1=1';
    const countParams = [];

    if (category && category !== 'All') {
      countQuery += ' AND category = ?';
      countParams.push(category);
    }

    if (minPrice) {
      countQuery += ' AND price >= ?';
      countParams.push(parseFloat(minPrice));
    }

    if (maxPrice) {
      countQuery += ' AND price <= ?';
      countParams.push(parseFloat(maxPrice));
    }

    if (search) {
      countQuery += ' AND (name LIKE ? OR description LIKE ? OR category LIKE ?)';
      const searchTerm = `%${search}%`;
      countParams.push(searchTerm, searchTerm, searchTerm);
    }

    console.log('Executing count query:', countQuery, 'with params:', countParams);
    const [countResult] = await db.execute(countQuery, countParams);
    const total = countResult[0].total;

    console.log(`Successfully found ${products.length} products, total: ${total}`);

    res.json({
      products,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get products error - Full error object:', error);
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    
    // Send more detailed error information
    res.status(500).json({ 
      error: 'Failed to fetch products', 
      details: error.message,
      type: error.name
    });
  }
});

// Get single product
router.get('/:id', async (req, res) => {
  try {
    console.log('GET /api/products/:id - Request received for product ID:', req.params.id);
    
    const { id } = req.params;

    // Check if database connection exists
    if (!db) {
      console.error('Database connection is null or undefined');
      return res.status(500).json({ error: 'Database connection error' });
    }

    console.log('Executing query for single product...');
    const [products] = await db.execute(
      'SELECT * FROM products WHERE id = ?',
      [id]
    );

    if (products.length === 0) {
      console.log('Product not found with ID:', id);
      return res.status(404).json({ error: 'Product not found' });
    }

    console.log('Product found:', products[0]);
    res.json(products[0]);
  } catch (error) {
    console.error('Get product error - Full error object:', error);
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    
    res.status(500).json({ 
      error: 'Failed to fetch product', 
      details: error.message,
      type: error.name
    });
  }
});

// Get product categories - Fixed the route path
router.get('/categories/list', async (req, res) => {
  try {
    console.log('GET /api/products/categories/list - Request received');
    
    // Check if database connection exists
    if (!db) {
      console.error('Database connection is null or undefined');
      return res.status(500).json({ error: 'Database connection error' });
    }

    console.log('Executing categories query...');
    const [categories] = await db.execute(
      'SELECT DISTINCT category FROM products WHERE category IS NOT NULL ORDER BY category'
    );

    const categoryList = ['All', ...categories.map(cat => cat.category)];
    console.log('Categories found:', categoryList);
    
    res.json(categoryList);
  } catch (error) {
    console.error('Get categories error - Full error object:', error);
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    
    res.status(500).json({ 
      error: 'Failed to fetch categories', 
      details: error.message,
      type: error.name
    });
  }
});

module.exports = router;
