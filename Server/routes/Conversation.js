const router = require("express").Router();
const ConversationModel = require("../models/conversation");
const { User } = require('../models/user');

router.get('/api/conversation/:userId', async (req, res) => {
    try {
        //console.log('demoooooooooooooooooooooo');
        const userId = req.params.userId;
      //  console.log(userId);
        const conversations = await ConversationModel.find({ members: userId });
        if (!conversations || conversations.length === 0) {
            console.log('No conversations found for user:', userId);
            return res.status(404).json({ message: 'No conversations found' });
        }
        
        const conversationDetails = await Promise.all(conversations.map(async (conversation) => {
            if (!conversation) {
                // when conversation is null or undefined
                console.log('Conversation is null or undefined');
               
            }
            const otherUserId = conversation.members.find(memberId => memberId.toString() !== userId);
            const user = await User.findById(otherUserId);
            //console.log('user', user);
          
          //  console.log("userIdDemo", userId);
            //console.log("otherUserId", otherUserId);
            return {
                conversationId: conversation.id,
                user: {
                    receiverId:otherUserId ,
                    firstname: user.firstName,
                   lastname: user.lastName,
                    email: user.email
                }
            };
        }));
        

        res.status(200).json(conversationDetails);
    } catch (error) {
        console.error('Error fetching conversationsssssss:', error);
        res.status(500).json({ message: 'Internal server errorrrrrrrrr' });
    }
});

router.post('/api/conversation', async (req, res) => {
    try {
        const { senderId, receiverId } = req.body;
        const newConversation = new ConversationModel({ members: [senderId, receiverId] });
        await newConversation.save();
        res.status(200).send('Conversation created Successfully');
    } catch (error) {
        console.error('Error creating conversation:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;
