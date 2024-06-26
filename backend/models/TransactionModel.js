const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const transactionSchema = new Schema({
    name: {
      type: String,
      required: true
    },
    isExpense: {
      type: Boolean,
    },
    isIncome: {
      type: Boolean,
    },
    amount: {
      type: Number,
      required: true
    },
    description: {
      type: String
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  }, {
    timestamps: true
  });
  
  const Transaction = mongoose.model('Transaction', transactionSchema);
  
  module.exports = Transaction;
  