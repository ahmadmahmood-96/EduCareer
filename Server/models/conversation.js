const mongoose = require('mongoose');
const ConversationSchema = new mongoose.Schema({
    members: {
        type: Array,
        required: true
    }
});
const ConversationModel = mongoose.model('Conversation',ConversationSchema);
module.exports= ConversationModel;