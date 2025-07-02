
const express = require('express');
const db = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Create order from cart
router.post('/create', authenticateToken, async (req, res) => {
  const connection = await db.getConnection();
  
  try {
    await connection.beginTransaction();

    const { shippingAddress, billingAddress } = req.body;

    // Get cart items
    const [cartItems] = await connection.execute(`
      SELECT 
        c.product_id,
        c.quantity,
        p.price,
        p.name,
        p.in_stock
      FROM cart c
      JOIN products p ON c.product_id = p.id
      WHERE c.user_id = ?
    `, [req.user.id]);

    if (cartItems.length === 0) {
      await connection.rollback();
      return res.status(400).json({ error: 'Cart is empty' });
    }

    // Check stock availability
    const outOfStockItems = cartItems.filter(item => !item.in_stock);
    if (outOfStockItems.length > 0) {
      await connection.rollback();
      return res.status(400).json({ 
        error: 'Some items are out of stock',
        outOfStockItems: outOfStockItems.map(item => item.name)
      });
    }

    // Calculate total
    const totalAmount = cartItems.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);

    // Create order
    const [orderResult] = await connection.execute(
      'INSERT INTO orders (user_id, total_amount, shipping_address, billing_address) VALUES (?, ?, ?, ?)',
      [req.user.id, totalAmount, JSON.stringify(shippingAddress), JSON.stringify(billingAddress)]
    );

    const orderId = orderResult.insertId;

    // Create order items
    for (const item of cartItems) {
      await connection.execute(
        'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
        [orderId, item.product_id, item.quantity, item.price]
      );
    }

    // Clear cart
    await connection.execute(
      'DELETE FROM cart WHERE user_id = ?',
      [req.user.id]
    );

    await connection.commit();

    res.status(201).json({
      message: 'Order created successfully',
      orderId,
      totalAmount
    });
  } catch (error) {
    await connection.rollback();
    console.error('Create order error:', error);
    res.status(500).json({ error: 'Failed to create order' });
  } finally {
    connection.release();
  }
});

// Get user's orders
router.get('/', authenticateToken, async (req, res) => {
  try {
    const [orders] = await db.execute(`
      SELECT 
        o.id,
        o.total_amount,
        o.status,
        o.created_at,
        o.shipping_address,
        JSON_ARRAYAGG(
          JSON_OBJECT(
            'product_id', oi.product_id,
            'product_name', p.name,
            'quantity', oi.quantity,
            'price', oi.price,
            'image', p.image
          )
        ) as items
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      LEFT JOIN products p ON oi.product_id = p.id
      WHERE o.user_id = ?
      GROUP BY o.id
      ORDER BY o.created_at DESC
    `, [req.user.id]);

    res.json(orders);
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Get single order
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const [orders] = await db.execute(`
      SELECT 
        o.*,
        JSON_ARRAYAGG(
          JSON_OBJECT(
            'product_id', oi.product_id,
            'product_name', p.name,
            'quantity', oi.quantity,
            'price', oi.price,
            'image', p.image
          )
        ) as items
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      LEFT JOIN products p ON oi.product_id = p.id
      WHERE o.id = ? AND o.user_id = ?
      GROUP BY o.id
    `, [id, req.user.id]);

    if (orders.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json(orders[0]);
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ error: 'Failed to fetch order' });
  }
});

module.exports = router;
