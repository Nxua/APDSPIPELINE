const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  payerAccount: {
    type: String,
    required: true,
  },
  recipientAccount: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  currency: {
    type: String,
    required: true,
  },
  provider: {
    type: String,
    required: true,
  },
  swiftCode: {
    type: String,
  },
  verified: {
    type: Boolean,
    default: false,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Transaction', transactionSchema);
