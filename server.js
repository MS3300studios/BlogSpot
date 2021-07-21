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
//creating web socket
const io = socket(server, corsOptions);

io.on('connection', (socket) => {
    socket.on('join', ({name}) => {
        console.log(`${name} joined the server`)
        socket.emit('message', {authorName: 'Admin', content: `${name} joined the server`, hour: '00:03'})
    })

    socket.on('sendMessage', message => {
        socket.emit('message', message)
    })

    socket.on('disconnect', ()=>{
        console.log("user disconnected")
    })
});
//each user gets his own socket