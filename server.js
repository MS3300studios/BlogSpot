const express = require("express");
const chalk = require("chalk");
const app = express();

app.use(require('./routes/users'));
app.use(require('./routes/blogs'));

app.listen(3001, ()=>{
    console.log(chalk.green("server is running on port 3001"));
});
