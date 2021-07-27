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

io.on('connection', (socket) => {    
    socket.on('join', ({userId, name, conversationId}) => {
        console.log(`${name} joined room nr: ${conversationId}`)
        socket.join(conversationId); //user is joining a specific room
        users.push({id: socket.id, name: name, conversationId: conversationId});
    })

    socket.on('sendMessage', (message) => {
        io.to(message.conversationId).emit('message', message);
    })

    socket.on('allUsers', () => {
        console.log(users)
    })

    socket.on('leaveConversation', ({conversationId}) => {
        console.log('user left the conversation: '+conversationId)
        socket.leave(conversationId); //unsubscribing to socket 
        let newUsers = users.filter(user => user.id !== socket.id);
        users = newUsers;
        console.log('new users:');
        console.log(users);
    })

    socket.on('disconnect', ()=>{
        console.log("user disconnected");
        let newUsers = users.filter(user => user.id !== socket.id);
        users = newUsers;
    })
});