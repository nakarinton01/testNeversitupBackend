import * as mongoose from 'mongoose'
const products = new mongoose.Schema({
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
})
module.exports = mongoose.model('products', products)