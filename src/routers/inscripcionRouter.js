const express = require('express');
const {
  postInscripcion,
  deleteInscripcion
} = require('../controllers/inscripcionController');

const { checkRole } = require('../middlewares/secure');
const { validatorHandler } = require('../middlewares/validatorHandler');
const { postInscripcionSchema, deleteInscripcionSchema } = require('../schemas/inscripcionSchema'); 

const router = express.Router();


router.post('/',
  checkRole(1,3),
  validatorHandler(postInscripcionSchema, 'body'),
  postInscripcion
);

router.delete('/:id', 
  checkRole(1,3), 
  validatorHandler(deleteInscripcionSchema, 'params'),
  deleteInscripcion
)

module.exports = router;