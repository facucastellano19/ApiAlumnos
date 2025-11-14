const getConnection = require('../db/mysql');
const bcrypt = require('bcrypt');
const { sign } = require('../utils/jwt');

class AlumnoService {
  async getAlumnos() {
    const connection = await getConnection();
    const query = `
      SELECT user_id as id, user_usuario as usuario, user_nombre as nombre, user_email as email FROM usuarios
      WHERE user_rol_id = 3 AND user_fecha_baja IS NULL
    `;
    const alumnos = await connection.query(query);
    return alumnos;
  }

  async getAlumnoById(id) {
    const connection = await getConnection();
    const query = `
      SELECT user_id as id, user_usuario as usuario, user_nombre as nombre, user_email as email FROM usuarios
      WHERE user_id = ? AND user_rol_id = 3 AND user_fecha_baja IS NULL
      LIMIT 1
    `;
    const resultados = await connection.query(query, [id]);
    return resultados.length > 0 ? resultados[0] : null;
  }


  async postAlumno(data) {
    const {
      nombre,
      email,
      usuario,
      password,
      usuario_alta = data.user_id
    } = data;

    const rol = 3;

    const connection = await getConnection();

    const hash = await bcrypt.hash(password, 10);

    const query = `
    INSERT INTO usuarios
      (user_nombre, user_email, user_usuario, user_password, user_rol_id, user_usuario_alta, user_fecha_alta)
    VALUES (?, ?, ?, ?, ?, ?, NOW())
  `;

    try {
      await connection.query(query, [
        nombre,
        email,
        usuario,
        hash,
        rol,
        usuario_alta
      ]);
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        if (error.message.includes('user_email')) {
          const customError = new Error('El email ya está registrado.');
          customError.status = 400;
          throw customError;
        } else if (error.message.includes('user_usuario')) {
          const customError = new Error('El nombre de usuario ya está en uso.');
          customError.status = 400;
          throw customError;
        } else if (error.message.includes('user_nombre')) {
          const customError = new Error('El nombre ya está registrado.');
          customError.status = 400;
          throw customError;
        } else {
          const customError = new Error('Error de datos duplicados.');
          customError.status = 400;
          throw customError;
        }
      }
      throw error;
    }

    return {
      nombre,
      email,
      usuario,
      rol
    };
  }

  async putAlumno(id, data) {
    const connection = await getConnection();

    const resultados = await connection.query(
      `SELECT * FROM usuarios WHERE user_id = ? AND user_rol_id = 3 AND user_fecha_baja IS NULL`,
      [id]
    );

    if (resultados.length === 0) {
      const error = new Error('Alumno no encontrado.');
      error.status = 404;
      throw error;
    }

    const alumnoActual = resultados[0];

    //Si en data no se pasan algunos campos, se mantienen los valores actuales del alumno
    // Esto permite que el usuario pueda modificar solo los campos que desee
    const {
      nombre = alumnoActual.user_nombre,
      email = alumnoActual.user_email,
      usuario = alumnoActual.user_usuario,
      password,
      usuario_modificacion = data.user_id,
    } = data;

    let passwordFinal = password

    if (password && password !== '') {
      passwordFinal = await bcrypt.hash(password, 10);
    } else {
      passwordFinal = alumnoActual.user_password;
    }

    const query = `
      UPDATE usuarios
      SET user_nombre = ?,
          user_email = ?,
          user_usuario = ?,
          user_password = ?,
          user_usuario_modificacion = ?,
          user_fecha_modificacion = NOW()
      WHERE user_id = ? AND user_rol_id = 3 AND user_fecha_baja IS NULL
    `;

    const result = await connection.query(query, [
      nombre,
      email,
      usuario,
      passwordFinal,
      usuario_modificacion,
      id
    ]);

    if (result.affectedRows === 0) {
      const error = new Error('No se pudo modificar el alumno.');
      error.status = 404;
      throw error;
    }

    const newPayload = {
      user_id: alumnoActual.user_id,
      user_nombre: nombre,
      user_rol_id: alumnoActual.user_rol_id
    };

    const newToken = sign(newPayload);

    return {
      id,
      nombre,
      email,
      usuario,
      usuario_modificacion,
      rol: 3,
      token: newToken
    };
  }

  async deleteAlumno(id, data) {
    const connection = await getConnection();

    const resultados = await connection.query(
      `SELECT * FROM usuarios WHERE user_id = ? AND user_rol_id = 3 AND user_fecha_baja IS NULL`,
      [id]
    );

    if (resultados.length === 0) {
      const error = new Error('Alumno no encontrado.');
      error.status = 404;
      throw error;
    }

    const query = `
    UPDATE usuarios
    SET user_fecha_baja = NOW(), user_usuario_baja = ?
    WHERE user_id = ? AND user_rol_id = 3 AND user_fecha_baja IS NULL
  `;

    const result = await connection.query(query, [data.user_id, id]);

    if (result.affectedRows === 0) {
      const error = new Error('Alumno no encontrado o ya dado de baja.');
      error.status = 404;
      throw error;
    }

    return {
      mensaje: `Alumno con ID ${id} dado de baja correctamente.`,
      usuario_baja: data.user_id
    };
  }

  async getAlumnoMaterias(id) {

    const connection = await getConnection();

    const query = `
      SELECT 
        u.user_id AS alumno_id, 
        m.materia_id, 
        m.materia_nombre,
        i.insc_id as id_inscripcion,
        c.carrera_nombre /* <-- CAMBIO AÑADIDO */
      FROM usuarios u
      LEFT JOIN inscripciones i ON i.insc_alumno_id = u.user_id AND i.insc_fecha_baja IS NULL
      LEFT JOIN materias m ON m.materia_id = i.insc_materia_id
      LEFT JOIN carreras c ON m.materia_carrera_id = c.carrera_id /* <-- CAMBIO AÑADIDO */
      WHERE u.user_id = ? 
        AND u.user_rol_id = 3 
        AND u.user_fecha_baja IS NULL
    `;
    const result = await connection.query(query, [id]);

    if (result.length === 0 || result[0].materia_id === null) {
      const error = new Error('El alumno no tiene materias inscriptas');
      error.status = 404;
      throw error;
    }

    return result
  }


}

module.exports = AlumnoService;
