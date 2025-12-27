const express = require('express');
const cors = require('cors');
const connectDB = require('./db');
require('dotenv').config();

const Product = require('./models/Product');
const Order = require('./models/Order');

const app = express();
connectDB();

app.use(cors());
app.use(express.json());


app.get('/api/products', async (req, res) => {
  res.json(await Product.find());
});

app.get('/api/products/:id', async (req, res) => {
  res.json(await Product.findById(req.params.id));
});

app.post('/api/products', async (req, res) => {
  res.json(await Product.create(req.body));
});

app.delete('/api/products/:id', async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: 'Product deleted' });
});


app.post('/api/orders', async (req, res) => {
  const order = await Order.create(req.body);
  res.json({ orderId: order._id });
});

app.get('/api/orders', async (req, res) => {
  res.json(await Order.find());
});


app.get('/api/seed-products', async (req, res) => {
  const products = [
    {
      name: 'Wireless Headphones',
      price: 6399,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
      category: 'Electronics',
      rating: 4.6,
      description: 'High quality wireless headphones'
    },
    {
      name: 'Fresh Apples (1kg)',
      price: 499,
      image: 'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=400',
      category: 'Groceries',
      rating: 4.8,
      description: 'Fresh red apples'
    },
    {
      name: "Men's Casual Shirt",
      price: 2999,
      image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400',
      category: 'Fashion',
      rating: 4.4,
      description: 'Comfortable cotton shirt'
    },
    {
      name: 'Table Lamp',
      price: 3499,
      image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400',
      category: 'Home & Living',
      rating: 4.5,
      description: 'Modern table lamp'
    }
  ];

  await Product.insertMany(products);
  res.json({ message: 'Dummy products inserted successfully' });
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log('Server running on port ' + PORT);
});
