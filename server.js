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

let users = [];

io.on('connection', (socket) => {
    socket.on('join', ({name, conversationId}) => {
        console.log(`${name} joined the conversation nr ${conversationId}`)
        let user = {
            id: socket.id,
            name: name,
            conversationId: conversationId
        }
        users.push(user);
        socket.join(conversationId) //user is joining a specific room
        io.to(conversationId).emit('message', {authorName: 'Admin', content: `${name} joined the server`, hour: '00:00'})
    })

    socket.on('sendMessage', message => {
        let currentUser = users.find(user => user.id === socket.id)
        io.to(currentUser.conversationId).emit('message', message);
    })

    socket.on('askForUsers', conversationId => {
        let usersInConversation = users.filter(user => user.conversationId === conversationId);
        io.to(conversationId).emit('usersInConversation', usersInConversation);
    })

    socket.on('leaveConversation', conversationId => {
        // let currentUser = users.find(user => user.id === socket.id)
        // let usersInConversation = users.filter(user => user.conversationId === currentUser.conversationId);
        // io.to(currentUser.conversationId).emit('usersInConversation', usersInConversation);
        users.forEach((user, index) => {
            if(user.id === socket.id){
                users.splice(index, 1);
            }
        })
    })

    socket.on('disconnect', ()=>{
        // let currentUser = users.find(user => user.id === socket.id)
        // let usersInConversation = users.filter(user => user.conversationId === currentUser.conversationId);
        // io.to(currentUser.conversationId).emit('usersInConversation', usersInConversation);
        users.forEach((user, index) => {
            if(user.id === socket.id){
                users.splice(index, 1);
            }
        })
        console.log("user disconnected")
    })
});