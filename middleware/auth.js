const jwt = require('jsonwebtoken');
const Customer = require('../db/models/customers');

//Authenticating using JWT token in each client request that needs to be authenticated.
const auth = async (req, res, next) => {
    try {
        let token;
        if (!req.header('Authorization')) {
            throw new Error();
        };
        token = req.header('Authorization').replace('Bearer ', '')

        var decoded = jwt.verify(token, process.env.JWT_SECRET_KEY)
        const user = await Customer.findOne({ _id: decoded._id, 'tokens.token': token })
        if (!user) {
            throw new Error()
        }
        req.user = user
        req.token = token
        next();
    } catch (error) {
        res.status(401).send({ error: 'please authenticate properly' })
    }
}

module.exports = auth;