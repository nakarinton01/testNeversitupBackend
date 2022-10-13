import * as mongoose from 'mongoose'
const users = new mongoose.Schema({
  fullName: { type: String },
  username: { type: String, unique: true },
  password: { type: String },
  email: { type: String, default: null },
  tel: { type: String, default: null },
  gender: { type: Number, default: null },
  birthday: { type: Date, default: null },
  createdAt: { type: Date },
})
module.exports = mongoose.model('users', users)