const express = require('express');
const {
    getMaterias,
    getMateriaById,
    postMateria,
    putMateria,
    deleteMateria,
    getMateriaAlumnos
} = require('../controllers/materiaController');

const { checkRole } = require('../middlewares/secure');
const { validatorHandler } = require('../middlewares/validatorHandler');
const { get } = require('./alumnoRouter');
const { getMateriaSchema, putMateriaSchema, postMateriaSchema, deleteMateriaSchema,getMateriaAlumnosSchema } = require('../schemas/materiaSchema'); 
const router = express.Router();

router.get('/', 
    checkRole(1,2,3), 
    getMaterias);

router.get('/:id', 
    checkRole(1,2,3),
    validatorHandler(getMateriaSchema, 'params'),
    getMateriaById
);


router.get('/:id/alumnos', 
    checkRole(1,2),
    validatorHandler(getMateriaAlumnosSchema, 'params'),
    getMateriaAlumnos
);

router.put('/:id', 
    checkRole(1),
    validatorHandler(putMateriaSchema, 'body'),
    putMateria
);

router.post('/', 
    checkRole(1),
    validatorHandler(postMateriaSchema, 'body'),
    postMateria
);

router.delete('/:id', 
    checkRole(1),
    validatorHandler(deleteMateriaSchema, 'params'),
    deleteMateria
);

module.exports = router;