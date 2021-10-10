const mongoose = require("mongoose");
const chalk = require("chalk");

// mongoose.connect( process.env.MONGODB_URI, { 
mongoose.connect( "mongodb://localhost/blogspot-react", { 
    useNewUrlParser: true, 
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
  }, function(){
  console.log(chalk.blue("MongoDB connected"));
});

module.exports = mongoose;

