const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema(
  {
    customerName: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    },
    address: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    paymentMethod: {
      type: String,
      required: true
    },
    items: [
      {
        _id: String,
        name: String,
        price: Number,
        quantity: Number
      }
    ],
    total: {
      type: Number,
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', OrderSchema);
