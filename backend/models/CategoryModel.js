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
    history: [
      {
        spent: {
          type: Number,
          default: 0,
        },
        earned: {
          type: Number,
          default: 0,
        },
        year: {
          type: Number,
          required: true,
        },
        month: {
          type: Number,
          required: true,
        },
      },
    ],
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
