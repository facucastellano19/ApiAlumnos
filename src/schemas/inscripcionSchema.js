const Joi = require('joi');

const id = Joi.number().integer().min(1).required()
  .messages({
    'any.required': 'El id es obligatorio',
    'number.base': 'El id debe ser un número',
    'number.min': 'El id debe ser mayor o igual a {#limit}',
  });


const postInscripcionSchema = Joi.object({
  alumno_id: id,
  materia_id: id,
  usuarioid: Joi.any().forbidden()
});

const deleteInscripcionSchema = Joi.object({
    id: id,
    usuarioid: Joi.any().forbidden()
});

module.exports = {postInscripcionSchema,deleteInscripcionSchema}