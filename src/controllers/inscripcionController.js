const InscripcionService = require('../services/inscripcionService');
const inscripcionService = new InscripcionService();

async function postInscripcion(req, res, next) {
  try {
    const data = req.body;
    data.user_id = req.user_id;

    const alumno = data.alumno_id;

    if (req.user_rol_id === 3 && req.user_id != alumno) {
      const error = new Error('Privilegios insuficientes');
      error.status = 403;
      throw error;
    }

    const nuevaInscripcion = await inscripcionService.postInscripcion(data);
    res.status(201).json(nuevaInscripcion);
  } catch (error) {
    next(error);
  }
}

async function deleteInscripcion(req, res, next) {
  try {
    const id = req.params.id;
    const user_id = req.user_id;
    const user_rol_id = req.user_rol_id;

    const inscripcion = await inscripcionService.getInscripcionById(id);

    if (!inscripcion) {
      const error = new Error('Inscripción no encontrada');
      error.status = 404;
      throw error;
    }

    if (user_rol_id === 3 && user_id !== inscripcion.alumno_id) {
      const error = new Error('Privilegios insuficientes');
      error.status = 403;
      throw error;
    }

    const result = await inscripcionService.deleteInscripcion(id, user_id);

    res.status(200).json(result);

  } catch (error) {
    next(error);
  }
}


module.exports = { postInscripcion, deleteInscripcion }