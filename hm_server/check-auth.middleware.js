const jwt = require("jsonwebtoken");
const config = require('./config');

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        //jwt.verify basically decodes the token
        const decodedToken = jwt.verify(token, config.secret);
        req.userData = { emailId: decodedToken.emailId, userId: decodedToken.userId }
        next();
    } catch (error) {
        res.status(401).json({
            message: "You are not authenticated!"
        })
    }
}