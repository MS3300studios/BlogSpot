const express = require("express");
const chalk = require("chalk");
const app = express();
const PORT = 3001;

app.use(require('./routes/users'));
app.use(require('./routes/blogs'));

app.listen(PORT, ()=>{
    console.log(chalk.green("------------------------------"));
    console.log(chalk.green(`server is running on port ${PORT}`));
});
