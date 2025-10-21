const express = require('express') 
const {login,register} = require('../controllers/usuarioController') 
const { checkRole } = require('../middlewares/secure')
const { validatorHandler } = require('../middlewares/validatorHandler');
const { postUsuarioSchema } = require('../schemas/usuariosSchema'); 

const usuarioRouter = express.Router()
usuarioRouter.use(express.json())

usuarioRouter.post('/login', login)

usuarioRouter.post('/register', 
    //Agregar luego de crear el primer usuario administrador
    //checkRole(1), 
    validatorHandler(postUsuarioSchema, 'body'),
    register)

module.exports = usuarioRouter