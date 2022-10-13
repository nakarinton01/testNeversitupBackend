import mongoose, { Schema, Types } from 'mongoose'
const orders = new mongoose.Schema({
  products: {
    _id: { type: Types.ObjectId },
    name: { type: String },
    price: { type: Number },
    amount: { type: Number },
    colors: [{
      _id : false,
      color: { type: String },
      amount: { type: Number }
    }],
    picture: { type: String },
    description: { type: String },
    rating : { type: Number },
  },
  custormer: {
    _id: { type: Types.ObjectId },
    username: { type: String },
  },
  status: { type: String },
  createdAt: { type: Date, default: new Date() },
  updateAt: { type: Date, default: new Date()  },
})
module.exports = mongoose.model('orders', orders)