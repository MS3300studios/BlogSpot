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

const server = app.listen(PORT, ()=>{
    console.log(chalk.green("------------------------------"));
    console.log(chalk.green(`server is running on port ${PORT}`));
});


//creating web socket
const io = socket(server);

io.on('connection', (socket) => {
    socket.on('message', ({userName, content, createdAt}) => {
        io.emit('message', {userName, content, createdAt});
    });
});
//each user gets his own socket