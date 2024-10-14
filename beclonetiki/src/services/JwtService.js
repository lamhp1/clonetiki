const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config()

const generateAccessToken = (payload) => {
    const accessToken = jwt.sign({
        ...payload
    }, process.env.ACCESS_TOKEN, { expiresIn: '1d'})

    return accessToken
}

const generateRefreshToken = (payload) => {
    const refreshToken = jwt.sign({
        ...payload
    }, process.env.REFRESH_TOKEN, { expiresIn: '365d'})

    return refreshToken
}

const refreshToken = (reToken) => {
    return new Promise((resolve, reject) => {
        try {
            jwt.verify(reToken, process.env.REFRESH_TOKEN, async function(err, user) {
                if (err) {
                    resolve({
                        status: 401,
                        err
                    })
                }
                const accessToken = await generateAccessToken({
                    id: user?.id,
                    isAdmin: user?.isAdmin
                })
                resolve({
                    status: "OK",
                    accessToken
                })
            })
        } catch (err) {
            reject(err)
        }
    })
}

module.exports = {
    generateAccessToken,
    generateRefreshToken,
    refreshToken
}