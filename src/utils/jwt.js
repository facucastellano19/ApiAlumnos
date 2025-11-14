const jwt = require('jsonwebtoken')

function sign(data) {
    return jwt.sign(data, process.env.JWT_SECRET, { expiresIn: '8h' })
}

function getToken(auth) {
    if (auth.indexOf('Bearer') === -1) {
        const error = new Error("Formato token inesperado")
        error.status = 400
        next(error)
    }

    let token = auth.replace('Bearer ', '')
    return token
}

function decode(auth) {
    const token = getToken(auth)
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    return decoded
}

module.exports = { sign, decode, }