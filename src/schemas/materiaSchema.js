const Joi = require('joi');

const id = Joi.number().integer().min(1)
    .messages({
        'number.base': 'El id debe ser un número',
        'number.min': 'El id debe ser mayor o igual a {#limit}',
    });

const nombre = Joi.string().min(3).max(50).required()
    .messages({
        'string.base': 'El nombre debe ser texto',
        'string.empty': 'El nombre es obligatorio',
    });

const carrera_id = Joi.number().integer().min(1).required()
    .messages({
        'number.base': 'El id debe ser un número',
        'number.min': 'El id debe ser mayor o igual a {#limit}',
    });

const usuarioid = Joi.number().integer().min(1).optional();

const postMateriaSchema = Joi.object({
    nombre: Joi.string().min(3).max(50).required()
        .messages({
            'string.base': 'El nombre debe ser texto',
            'string.empty': 'El nombre es obligatorio',
        }),
    carrera_id: Joi.number().integer().min(1).required()
        .messages({
            'number.base': 'El id debe ser un número',
            'number.min': 'El id debe ser mayor o igual a {#limit}',
        }),
    usuarioid: Joi.any().forbidden() 
});

const putMateriaSchema = Joi.object({
    nombre: nombre.optional(),
    carrera_id: carrera_id.optional(),
    usuarioid: usuarioid.forbidden()  
});

const getMateriaSchema = Joi.object({
    id: id.required().integer().min(1).required().messages({
        'number.base': 'El id debe ser un número',
    })
});

const getMateriaAlumnosSchema = Joi.object({
    id: id.required().integer().min(1).required().messages({
        'number.base': 'El id debe ser un número',
    })
});

const deleteMateriaSchema = Joi.object({
  id: Joi.number().integer().min(1).required().messages({
        'number.base': 'El id debe ser un número',
    })
});


module.exports = {
    postMateriaSchema,
    putMateriaSchema,
    getMateriaSchema,
    deleteMateriaSchema,
    getMateriaAlumnosSchema
};
