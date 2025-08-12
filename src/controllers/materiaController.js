const { post } = require('../routers/alumnoRouter');
const MateriaService = require('../services/materiaService');
const materiaService = new MateriaService();

async function getMaterias(req, res, next) {
  try {
    const materias = await materiaService.getMaterias();
    res.json(materias);
  } catch (error) {
    next(error);
  }
}

async function getMateriaById(req, res, next) {
  try {
    const id = req.params.id;
    const [materia] = await materiaService.getMateriaById(id);
    if (!materia) {
      const error = new Error('Materia no encontrada');
      error.status = 404;
      throw error;
    }
    res.json(materia);
  } catch (error) {
    next(error);
  }
}

async function getMateriaAlumnos(req, res, next) {
  try {
    const id = req.params.id;
    
    const materiaAlumnos = await materiaService.getMateriaAlumnos(id);
    res.json(materiaAlumnos);
  } catch (error) {
    next(error);
  }
}

async function postMateria(req, res, next) {
  try {
    const data = req.body;
    data.user_id = req.user_id; 
    const nuevaMateria = await materiaService.postMateria(data);
    res.json(nuevaMateria);
  } catch (error) {
    next(error);
  }
}

async function putMateria(req, res, next) {
  try {
    const id = req.params.id;
    const data = req.body;
    data.user_id = req.user_id; 
    const materiaActualizada = await materiaService.putMateria(id, data);
    res.json(materiaActualizada);
  } catch (error) {
    next(error);
  }
  
}

async function deleteMateria(req, res, next) {
  try {
    const id = req.params.id;
    const user_id = req.user_id;
    const resultado = await materiaService.deleteMateria(id, user_id);
    res.json(resultado);
  } catch (error) {
    next(error);
  }
}



module.exports = {getMaterias, getMateriaById, putMateria, postMateria, deleteMateria, getMateriaAlumnos};