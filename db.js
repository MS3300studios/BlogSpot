const mongoose = require("mongoose");
const chalk = require("chalk");

mongoose.connect("mongodb://localhost/blogspot-react",function(){
  console.log(chalk.blue("MongoDB connected"));
});

module.exports = mongoose;
