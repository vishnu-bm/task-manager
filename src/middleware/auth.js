const NewUser = require('../models/users')
const jwt = require('jsonwebtoken')

const auth = async (req, res, next) => {
    if (req.headers['authorization']) {
        try {
            let authorization = req.headers['authorization'].split(' ');
            if (authorization[0] !== 'Bearer') {
                return res.status(401).send('invalid request'); //invalid request
            } else {
                const decoded = jwt.verify(authorization[1], "Agent47");
                const user = await NewUser.findOne({ _id: decoded._id, 'tokens.token': authorization[1] })
                if (!user) {
                    throw new Error()
                }
                req.token = authorization[1]
                req.user = user
                next();
            }
        } catch (err) {
            return res.status(403).send(); //invalid token
        }
    } else {
        return res.status(401).send('invalid request');
    }

}

module.exports = auth