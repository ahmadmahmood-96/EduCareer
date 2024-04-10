const mongoose = require('mongoose');
const MessageSchema = new mongoose.Schema({
    conversationId: {
        type: String,
        required: true
    },
    senderId:{
        type:String,
    },
    Message:{
        type:String,
        
    }

});
const MessageModel = mongoose.model('Message',MessageSchema);
module.exports= MessageModel;