const express = require('express')
const { Server } = require('socket.io')
const http = require('http')
const getUserDetailsFromToken = require('../helpers/getUserDetailesFromToken')
const UserModel = require('../models/userModel')
const { ConversatinModel, MessageModel } = require('../models/conversationModel')

const app = express()

// socket connection


//
const onlineUser=new Set()
const server = http.createServer(app)
const io = new Server(server, {
    cors: {
        origin: process.env.FRONTEND_URL,
        credentials: true
    }
})

io.on('connection',async(socket)=>{
    console.log("connection user",socket.id);
    const token=socket.handshake.auth.token

    //cuurrent user detailes
    const user =await getUserDetailsFromToken(token)    
    
    //create a room
    socket.join(user?._id.toString())
    onlineUser.add(user?._id.toString())
    io.emit('onlineUser',Array.from(onlineUser))

    socket.on('message-page',async(userId)=>{
        console.log('userId',userId);
        const userDetails=await UserModel.findById(userId).select("-password")

        const payload={
            _id:userDetails?._id,
            name:userDetails?.name,
            email:userDetails?.email,
            profile:userDetails?.profile,
            online:onlineUser.has(userId)
        }

        socket.emit('message-user',payload)

        //get previous messages
        const getConversationMessages = await ConversatinModel.findOne({
            "$or": [
                { sender: user?._id, receiver: userId },
                { sender: userId, receiver: user?._id }
            ]
        }).populate('messages').sort({ updateAt: -1 });

        socket.emit('message',getConversationMessages.messages)
        

    })

    //new message
    socket.on('new message', async (data) => {
        try {
            let conversation = await ConversatinModel.findOne({
                "$or": [
                    { sender: data?.sender, receiver: data?.receiver },
                    { sender: data?.receiver, receiver: data?.sender }
                ]
            });
    
            if (!conversation) {
                const createConversation = new ConversatinModel({
                    sender: data?.sender,
                    receiver: data?.receiver
                });
                conversation = await createConversation.save();
            }
    
            const message = new MessageModel({
                text: data?.text,
                imageUrl: data?.imageUrl,
                videoUrl: data?.videoUrl,
                msgByUserId: data?.msgByUserId
            });
            
            const saveMessage = await message.save();
            await ConversatinModel.updateOne({ _id: conversation?._id }, {
                "$push": { messages: saveMessage?._id }
            });
    
            const getConversationMessages = await ConversatinModel.findOne({
                "$or": [
                    { sender: data?.sender, receiver: data?.receiver },
                    { sender: data?.receiver, receiver: data?.sender }
                ]
            }).populate('messages').sort({ updateAt: -1 });
    
            io.to(data?.sender).emit('message', getConversationMessages.messages);
            io.to(data?.receiver).emit('message', getConversationMessages.messages);
        } catch (error) {
            console.error("Error in new message:", error);
            socket.emit('error', { message: 'Could not send message' });
        }
    });
    

    //disconnect
    socket.on('disconnect',()=>{
        onlineUser.delete(user?._id)
        console.log("disconnected user",socket?.id);
    })
})

module.exports={
    app,
    server
}