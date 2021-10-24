const mongoose = require("mongoose");
const chalk = require("chalk");
const configMode = require('./serverConfig');

let connectUri = "mongodb://localhost/blogspot-react";
let local = true;
if(configMode.mode === "production"){
  connectUri = process.env.MONGODB_URI;
  local = false;
}

mongoose.connect( connectUri, { 
  useNewUrlParser: true, 
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false
}, function(){
  console.log(chalk.blue(`MongoDB connected to ${local ? "local": "cloud"} database`));
});

module.exports = mongoose;