const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try{
        const userToken = req.headers.authorization;
        const decoded = jwt.decode(userToken, process.env.SECRET);
        req.userData = decoded;
        next();
    } catch(error){
        return res.sendStatus(401);
    }
}