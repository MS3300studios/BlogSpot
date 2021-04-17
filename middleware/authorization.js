const jwt = require('jsonwebtoken');
const secret = require('../secret.json');

module.exports = (req, res, next) => {
    try{
        const userToken = req.headers.authorization;
        const decoded = jwt.decode(userToken, secret.key);
        req.userData = decoded;
        next();
    } catch(error){
        return res.sendStatus(401);
    }
}