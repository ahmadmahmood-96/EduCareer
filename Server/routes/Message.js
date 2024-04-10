const router = require("express").Router();
const MessageModel = require("../models/Messages");
const ConversationModel = require("../models/conversation");
// const UserModel = require("../models/user");

// POST route to send a message
router.post('/api/message', async (req, res) => {
    try {
        const { conversationId, senderId, Message, receiverId = '' } = req.body;
        // Check if required fields are provided
        if (!senderId || !Message) return res.status(400).send('Please provide senderId and Message');
        // If conversationId is 'new', create a new conversation
        if (conversationId === 'new' && receiverId) {
            const newConversation = new ConversationModel({ members: [senderId, receiverId] });
            await newConversation.save();

            const newMessage = new MessageModel({ conversationId: newConversation._id, senderId, Message });
            await newMessage.save();

            return res.status(200)
        } else if (!conversationId || !receiverId) {
            return res.status(400).send('Please provide all required fields');
        }

        const newMessage = new MessageModel({ conversationId, senderId, Message });
        await newMessage.save();
        res.status(200)
    } catch (error) {
        console.log('Error:', error);
        res.status(500).send('Internal Server Error');
    }
});

router.get('/api/message/:conversationId', async (req, res) => {
    try {
        const ConversationId = req.params.conversationId;
        const senderId=req.query.senderId;
        const receiverId=req.query.receiverId;

        console.log("demoooo it touched me", ConversationId);
        if (ConversationId === 'new') {
            const existingConversation = await ConversationModel.find({
                members: { $all: [senderId, receiverId] }
            });
        
            if (existingConversation.length > 0) {
                const messages = await MessageModel.find({ conversationId: existingConversation[0]._id });
                //console.log(messages);  
                res.status(200).json(messages);
            } else {
                return res.status(200).json([]);
            }
        } else {
            //
            console.log("it is important", ConversationId);
            const messages = await MessageModel.find({ conversationId: ConversationId });
            //console.log(messages);  
            res.status(200).json(messages);
        }
        
    } catch (error) {
        console.log('Error:', error);
        res.status(500).send('Internal Server Error');
    }
});


module.exports = router;
