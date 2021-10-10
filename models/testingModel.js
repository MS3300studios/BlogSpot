const db = require("../db");

const schema = new db.Schema({
    value: {type: String, require: true}
});

const TestingModel = db.model("TestingModel", schema);
module.exports = TestingModel;
