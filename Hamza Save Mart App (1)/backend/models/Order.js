const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  customerName: String,
  email: String,
  phone: String,
  address: String,
  city: String,
  paymentMethod: String,
  items: Array,
  total: Number,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);
