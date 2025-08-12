const AlumnoService = require('../services/alumnoService');
const alumnoService = new AlumnoService();

async function getAlumnos(req, res, next) {
  try {
    const alumnos = await alumnoService.getAlumnos();
    res.json(alumnos);
  } catch (error) {
    next(error);
  }
}

async function getAlumnoById(req, res, next) {
  
  try {
    const id = req.params.id;
    const { user_id, user_rol_id } = req; 

    if (user_rol_id === 3 && user_id.toString() !== id) {
      const error = new Error('No autorizado para ver este alumno');
      error.status = 403;
      throw error;
    }
    
    const alumno = await alumnoService.getAlumnoById(id);
    if (!alumno) {
      const error = new Error('Alumno no encontrado');
      error.status = 404;
      throw error;
    }
    res.json(alumno);
  } catch (error) {
    next(error);
  }
}


async function postAlumno(req, res, next) {
  try {
    const data = req.body;
    data.user_id = req.user_id; 
    const nuevoAlumno = await alumnoService.postAlumno(data);
    res.status(201).json(nuevoAlumno);
  } catch (error) {
    next(error);
  }
}

async function putAlumno(req, res, next) {
  try {
    const id = req.params.id;
    const data = req.body
    
    const { user_id, user_rol_id } = req;

    if (user_rol_id === 3 && user_id.toString() !== id) {
      const error = new Error('No autorizado para modificar este alumno');
      error.status = 403;
      throw error;
    }

    data.user_id = req.user_id;     
    const alumnoActualizado = await alumnoService.putAlumno(id, data);
    res.json(alumnoActualizado);
  } catch (error) {
    next(error);
  }
}

async function deleteAlumno(req, res, next) {
  try {
    const id = req.params.id;
    const data = {
      user_id: req.user_id
    }; 

    const resultado = await alumnoService.deleteAlumno(id, data);
    res.json(resultado);
  } catch (error) {
    next(error);
  }
}

async function getAlumnoMaterias(req, res, next) {
  
  try {
    const id = req.params.id;
    const { user_id, user_rol_id } = req; 

    if (user_rol_id === 3 && user_id.toString() !== id) {
      const error = new Error('No autorizado para ver las materias de este alumno');
      error.status = 403;
      throw error;
    }
    
    const alumnoMaterias = await alumnoService.getAlumnoMaterias(id);

    res.json(alumnoMaterias);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getAlumnos,
  getAlumnoById,
  postAlumno,
  putAlumno,
  deleteAlumno,
  getAlumnoMaterias
};
