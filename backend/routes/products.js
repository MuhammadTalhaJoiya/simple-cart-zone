
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

    // Apply filters
    if (category && category !== 'All') {
      query += ' AND category = ?';
      params.push(category);
    }

    if (minPrice) {
      query += ' AND price >= ?';
      params.push(parseFloat(minPrice));
    }

    if (maxPrice) {
      query += ' AND price <= ?';
      params.push(parseFloat(maxPrice));
    }

    if (search) {
      query += ' AND (name LIKE ? OR description LIKE ? OR category LIKE ?)';
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
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

    // Apply pagination
    const offset = (parseInt(page) - 1) * parseInt(limit);
    query += ' LIMIT ? OFFSET ?';
    params.push(parseInt(limit), offset);

    console.log('Executing query:', query, 'with params:', params);
    const [products] = await db.execute(query, params);

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

    const [countResult] = await db.execute(countQuery, countParams);
    const total = countResult[0].total;

    console.log(`Found ${products.length} products, total: ${total}`);

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
    console.error('Get products error:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Get single product
router.get('/:id', async (req, res) => {
  try {
    console.log('GET /api/products/:id - Request received for product ID:', req.params.id);
    
    const { id } = req.params;

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
    console.error('Get product error:', error);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

// Get product categories - Fixed the route path
router.get('/categories/list', async (req, res) => {
  try {
    console.log('GET /api/products/categories/list - Request received');
    
    const [categories] = await db.execute(
      'SELECT DISTINCT category FROM products WHERE category IS NOT NULL ORDER BY category'
    );

    const categoryList = ['All', ...categories.map(cat => cat.category)];
    console.log('Categories found:', categoryList);
    
    res.json(categoryList);
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

module.exports = router;
