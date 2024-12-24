const { ConversatinModel } = require("../models/conversationModel");

const getConversation = async (currentUserId) => {
  if (currentUserId) {
    const currentUserConversation = await ConversatinModel.find({
      "$or": [
        { sender: currentUserId },
        { receiver: currentUserId },
      ],
    })
      .sort({ updatedAt: -1 })
      .populate('messages')
      .populate('sender')
      .populate('receiver');
    
    const conversation = currentUserConversation.map((conv) => {
      const countUnseenMsg = conv?.messages.reduce((prev, curr) => {
        const msgByUserId = curr?.msgByUserId?.toString();
        
        // Check if the message is not sent by the current user and is unseen
        if (msgByUserId !== currentUserId) {
          return prev + (curr.seen ? 0 : 1);
        }
        
        return prev;
      }, 0);
      
      return {
        _id: conv?._id,
        sender: conv?.sender,
        receiver: conv?.receiver,
        unseenMsg: countUnseenMsg,
        lastMsg: conv.messages[conv?.messages?.length - 1],
      };
    });

    return conversation;
  } else {
    return [];
  }
};

module.exports = getConversation;
