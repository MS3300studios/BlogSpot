const express = require("express");
const socket = require('socket.io');
const chalk = require("chalk");
const app = express();
const PORT = 3001;

app.use(require('./routes/users'));
app.use(require('./routes/blogs'));
app.use(require('./routes/comments'));
app.use(require('./routes/likes'));
app.use(require('./routes/friends'));
app.use(require('./routes/notifications'));
app.use(require('./routes/photos'));
app.use(require('./routes/socialBoard'));
app.use(require('./routes/getSocialNumbers'));
app.use(require('./routes/conversations'));
app.use(require('./routes/messages'));
app.use(require('./routes/lastReadMessages'));
app.use(require('./routes/blockingUsers'));

require("dotenv").config();

const server = app.listen(PORT, ()=>{
    console.log(chalk.green("------------------------------"));
    console.log(chalk.green(`server is running on port ${PORT}`));
});

const corsOptions = {
    cors: true,
    origins: ["http://localhost:3000"]
}
const io = socket(server, corsOptions);

let users = []; //here are sockets that are in a room, active sockets that are not in a room aren't stored in this array
let onlineUsers = [];


const Message = require('./models/message');

io.on('connection', (socket) => {  

    socket.on('test', () => {
        console.log(test)
    })

    socket.on('online', ({userId}) => {
        onlineUsers.push({userId: userId, socketId: socket.id});
        console.log(onlineUsers)
        socket.broadcast.emit('onlineUsers', onlineUsers); 
    })
    
    socket.on('getOnlineUsers', () => {
        socket.broadcast.emit('onlineUsers', onlineUsers); 
    })

    socket.on('checkUserOnlineStatus', (userId) => {
        console.log(onlineUsers)
        let isOnline = onlineUsers.findIndex(user => user.userId === userId);
        if(isOnline !== -1) socket.emit('userOnlineStatus', true); 
        else socket.emit('userOnlineStatus', false); 
    })
    
    socket.on('logOnlineUsers', () => {
        console.log(onlineUsers)
        console.log('----------------')
    })
    
    socket.on('join', ({userId, name, conversationId}) => {
        console.log(`${name} joined room nr: ${conversationId}`)
        socket.join(conversationId); //user is joining a specific room
        users.push({id: socket.id, name: name, conversationId: conversationId});
    })

    socket.on('sendMessage', (message) => {
        io.to(message.conversationId).emit('message', message);
        
        const msg = new Message({
            authorId: message.authorId,
            authorName: message.authorName,
            content: message.content,
            conversationId: message.conversationId,
            hour: message.hour
        });
    
        msg.save();
    })

    socket.on('allUsers', () => {
        console.log(users)
    })

    socket.on('leaveConversation', ({conversationId}) => {
        console.log('user left the conversation: '+conversationId)
        socket.leave(conversationId); //unsubscribing to socket 
        let newUsers = users.filter(user => user.id !== socket.id);
        users = newUsers;
        console.log('new users that are in conversations:');
        console.log(users);
    })

    socket.on('disconnect', ()=>{
        console.log("user disconnected");

        /* let disconnectingUser = users.filter(user => user.socketId === socket.id)[0];
        console.log(socket.id)
        console.log(disconnectingUser)
        socket.emit('userOnlineStatus', {isOnline: false, userId: }); */
        
        let newUsers = users.filter(user => user.socketId !== socket.id);        
        let newonlineUsers = onlineUsers.filter(user => user.socketId !== socket.id);
        
        users = newUsers;
        onlineUsers = newonlineUsers;
    })
});