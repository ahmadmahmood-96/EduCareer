const mongoose = require('mongoose');

// Define a schema for the support form fields
const supportSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId,
     ref: 'user', 
     required: true },
  subject: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  attachment: {
    type: String, 
    required: false
  }
});
const SupportModel = mongoose.model('supports', supportSchema);

module.exports = SupportModel;




