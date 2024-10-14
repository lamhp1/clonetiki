const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config()

const authMiddleware = (req, res, next) => {
    const token = req.headers.token.split(' ')[1]
    jwt.verify(token, process.env.ACCESS_TOKEN, function (err, user) {
        if(err) {
            return res.status(404).json({message: 'Access denied. No token provided.'})
        }
        if(user?.isAdmin) {
            next()
        } else {
            return res.status(404).json({message: 'the user is not Adminator'})
        }
    });
}

const authUserMiddleware = (req, res, next) => {
    const token = req.headers.token.split(' ')[1]
    const idUser = req.params.id
    jwt.verify(token, process.env.ACCESS_TOKEN, function(err, user) {
        if (err) {
            return res.status(404).json({message: 'Access denied. No token provided.'})
        }
        if(user?.id === idUser || user?.isAdmin === true ) {
            next()
        } else {
            return res.status(404).json({message: 'the user cannot get details other user'})
        }

    })
}

module.exports = {
    authMiddleware,
    authUserMiddleware
}