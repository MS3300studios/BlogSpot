const db = require("../db");

const schema = new db.Schema({
    userId: {type: String, require: true},
    show: {type: Boolean, require: true}
},
{
    timestamps: true
});

const showCookiesBanner = db.model("showCookiesBanner", schema);

module.exports = showCookiesBanner;