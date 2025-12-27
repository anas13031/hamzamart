require('dotenv').config(); 

const express = require('express');
const cors = require('cors');
const connectDB = require('./db');

const Product = require('./models/Product');
const Order = require('./models/Order');

const app = express();

app.use(cors());
app.use(express.json());

connectDB();


app.get('/api/products', async (req, res) => {
  res.json(await Product.find());
});

app.post('/api/orders', async (req, res) => {
  const order = await Order.create(req.body);
  res.json({ orderId: order._id });
});


app.get('/', (req, res) => {
  res.send('Hamza Save Mart Backend Running');
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log('Server running on port ' + PORT);
});
