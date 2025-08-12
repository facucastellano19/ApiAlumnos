const UsuarioService = require('../services/usuarioService')
const service = new UsuarioService()

async function login(req, res, next) {
    try {
        const data = req.body 
        const result = await service.login(data)
        res.send(result)
    } catch(error) {
        next(error)
    }
}

async function register(req, res, next) {
    try {
        const data = req.body
        const userId = req.user_id
        data.user_id = userId 
        const result = await service.register(data)
        res.send(result)
    } catch(error) {
        next(error)
    }
}

module.exports = { login,register}
