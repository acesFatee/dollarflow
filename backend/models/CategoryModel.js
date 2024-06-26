const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const categorySchema = new Schema({
    name: {
      type: String,
      required: true
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    spent: {
      type: Number,
      default: 0,
      required: true
    },
    earned: {
      type: Number,
      default: 0,
    },
    limit: {
      type: Number, 
    },
    isExpense: {
      type: Boolean,
      required: true
    },
  });
  
  const Category = mongoose.model('Category', categorySchema);
  
  module.exports = Category;
