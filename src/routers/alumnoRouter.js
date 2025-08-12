const express = require('express');
const {
  getAlumnos,
  getAlumnoById,
  postAlumno,
  putAlumno,
  deleteAlumno,
  getAlumnoMaterias
} = require('../controllers/alumnoController');

const { checkRole } = require('../middlewares/secure');
const { validatorHandler } = require('../middlewares/validatorHandler');
const { postAlumnoSchema, putAlumnoSchema, getAlumnoSchema, deleteAlumnoSchema, getAlumnoMateriasSchema } = require('../schemas/alumnoSchema'); // asumo que tenés validadores Joi

const router = express.Router();


router.get('/', 
  checkRole(1,2), 
  getAlumnos);

router.get('/:id', 
  checkRole(1,2,3), 
  validatorHandler(getAlumnoSchema, 'params'), 
  getAlumnoById);

router.get('/:id/materias',
  checkRole(1,2,3),
  validatorHandler(getAlumnoMateriasSchema, 'params'),
  getAlumnoMaterias
)

router.post('/',
  checkRole(1),
  validatorHandler(postAlumnoSchema, 'body'),
  postAlumno
);

router.put('/:id',
  checkRole(1,3),
  validatorHandler(putAlumnoSchema, 'body'),
  putAlumno
);

router.delete('/:id', 
  checkRole(1), 
  validatorHandler(deleteAlumnoSchema, 'params'),
  deleteAlumno);

module.exports = router;
