const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const Product = require('./models/Product');
const Order = require('./models/Order');

const app = express();

/* ================= CORS (MOST IMPORTANT PART) ================= */
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type']
}));

app.options('*', cors()); // preflight fix

/* ================= MIDDLEWARE ================= */
app.use(express.json());

/* ================= DB CONNECT ================= */
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error(err));

/* ================= ROUTES ================= */
app.get('/api/products', async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

app.post('/api/orders', async (req, res) => {
  try {
    const order = await Order.create(req.body);
    res.json({ success: true, orderId: order._id });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Order failed' });
  }
});

/* ================= SERVER ================= */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
