const Joi = require('joi');

const id = Joi.number().integer().min(1)
  .messages({
    'number.base': 'El id debe ser un número',
    'number.min': 'El id debe ser mayor o igual a {#limit}',
  });


const rol_id = Joi.number().integer().min(1)
  .messages({
    'number.base': 'El id debe ser un número',
    'number.min': 'El id debe ser mayor o igual a {#limit}',
  });

const nombre = Joi.string().min(3).max(50).required()
  .messages({
    'string.base': 'El nombre debe ser texto',
    'string.empty': 'El nombre es obligatorio',
    'string.min': 'El nombre debe tener al menos {#limit} caracteres',
    'string.max': 'El nombre no puede tener más de {#limit} caracteres'
  });

const email = Joi.string().email().required()
  .messages({
    'string.email': 'Debe ser un email válido',
    'string.empty': 'El email es obligatorio'
  });

const usuario = Joi.string().min(3).max(20).required()
  .messages({
    'string.empty': 'El usuario es obligatorio',
    'string.min': 'El usuario debe tener al menos {#limit} caracteres',
    'string.max': 'El usuario no puede tener más de {#limit} caracteres'
  });

const password = Joi.string().min(6).max(50).required()
  .messages({
    'string.empty': 'La contraseña es obligatoria',
    'string.min': 'La contraseña debe tener al menos {#limit} caracteres',
    'string.max': 'La contraseña no puede tener más de {#limit} caracteres'
  });

const postUsuarioSchema = Joi.object({
  nombre,
  email,
  usuario,
  password,
  rol_id,
  usuarioid: Joi.any().forbidden() 
});


module.exports = {postUsuarioSchema}