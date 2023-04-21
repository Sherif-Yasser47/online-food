const mongoose = require('mongoose');
const { Schema } = mongoose;


const orderSchema = new Schema({
  cust_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Customer',
  },
  cust_name: {
    type: String,
    required: true,
    ref: 'Customer',
  },
  order_items: [
    {
      name: { type: String, required: true },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },
      id: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'FoodItem',
      },
    },
  ],
  payment_method: {
    type: String,
    required: true,
    lowercase: true,
    enum: { values: ['cash', 'credit'], message: 'method must be Cash or Credit' }
  },
  payment_id: {
    type: Schema.Types.ObjectId,
    default: null
  },
  total_price: {
    type: Number,
    required: true,
    default: 0.0,
  },
  is_paid: {
    type: Boolean,
    required: true,
    default: false,
  }
}, {
  timestamps: true
});

//This also can be calculated on the client-side and sent in the req
//but in this demo it will be calculated on server.
orderSchema.pre('save', async function () {
  this.order_items.forEach(function (item) {
    this.total_price += item.price;
  })
  return;
});

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;