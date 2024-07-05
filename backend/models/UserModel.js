const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  clerkId: {
    type: String,
    required: true
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  funds: {
    type: Number,
    default: 0
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
});

const User = mongoose.model('User', userSchema);

module.exports = User;
