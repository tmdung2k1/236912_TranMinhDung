const mongoose = require('mongoose');

const foodSchema = new mongoose.Schema({
  foodId: {
    type: String,
    required: [true, 'Mã món ăn (foodId) là bắt buộc'],
    unique: true,
    trim: true
  },
  name: {
    type: String,
    required: [true, 'Tên món ăn là bắt buộc'],
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Loại món ăn là bắt buộc'],
    trim: true
  },
  cuisine: {
    type: String,
    required: [true, 'Ẩm thực/vùng miền là bắt buộc'],
    trim: true
  },
  ingredients: {
    type: [String],
    default: []
  },
  price: {
    type: Number,
    required: [true, 'Giá bán là bắt buộc'],
    min: [0, 'Giá bán không được âm']
  },
  quantity: {
    type: Number,
    required: [true, 'Số lượng là bắt buộc'],
    min: [0, 'Số lượng không được âm']
  },
  description: {
    type: String,
    default: ''
  },
  imageUrl: {
    type: String,
    default: ''
  }
}, {
  timestamps: true,
  collection: 'foods' // Đảm bảo lưu đúng vào collection foods
});

module.exports = mongoose.model('Food', foodSchema);