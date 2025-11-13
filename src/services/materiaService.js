const getConnection = require('../db/mysql');

class MateriaService {
    async getMaterias() {
        const connection = await getConnection();

        const query = `
            SELECT 
            materia_id as id,
            materia_nombre as nombre, 
            materia_carrera_id as carrera_id, 
            carrera_nombre as carrera_nombre
            FROM materias m 
            INNER JOIN carreras c
            ON c.carrera_id = m.materia_carrera_id
            WHERE m.materia_fecha_baja is null and c.carrera_fecha_baja is null
    `;
        const materias = await connection.query(query);
        return materias;
    }

    async getMateriaById(id) {
        const connection = await getConnection();
        const materia = await connection.query(`
      SELECT materia_id as id, materia_nombre as nombre, materia_carrera_id as carrera_id
      FROM materias 
      WHERE materia_id = ? AND materia_fecha_baja IS NULL
    `, [id]);
        return materia;
    }


    async postMateria(data) {
        const {
            nombre,
            carrera_id,
            usuario_alta = data.user_id 
        } = data;

        const connection = await getConnection();

        const query = `
      INSERT INTO materias
        (materia_nombre, materia_carrera_id, materia_usuario_alta, materia_fecha_alta)
      VALUES (?, ?, ?, NOW())
    `;

        try {
            const result = await connection.query(query, [
                nombre,
                carrera_id,
                usuario_alta
            ]);

            return {
                id: result.insertId,
                nombre,
                carrera_id,
                usuario_alta
            };
        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                const customError = new Error('Ya existe una materia con ese nombre en esa carrera.');
                customError.status = 400;
                throw customError;
            }
        }
    }

    async putMateria(id, data) {
        const connection = await getConnection();

        const resultados = await connection.query(`
        SELECT materia_id, materia_nombre, materia_carrera_id
        FROM materias where materia_id = ? and materia_fecha_baja is null
        `, [id]
        )

        if (resultados.length === 0) {
            const error = new Error('Alumno no encontrado.');
            error.status = 404;
            throw error;
        }

        const materiaActual = resultados[0];

        const {
            nombre = materiaActual.materia_nombre,
            carrera_id = materiaActual.materia_carrera_id,
            usuario_modificacion = data.user_id
        } = data

        const query = `UPDATE materias set 
        materia_nombre = ?, 
        materia_carrera_id = ?, 
        materia_usuario_modificacion = ?, 
        materia_fecha_modificacion = NOW() 
        WHERE materia_id = ?`;

        const results = connection.query(query, [
            nombre,
            carrera_id,
            usuario_modificacion,
            id
        ]);

        if (results.affectedRows === 0) {
            const error = new Error('Materia no encontrada.');
            error.status = 404;
            throw error;
        }

        return {
            id,
            nombre,
            carrera_id,
            usuario_modificacion
        };
    }

    async deleteMateria(id, user_id) {
        const connection = await getConnection();

        const resultados = await connection.query(
            `SELECT * FROM materias WHERE materia_id = ? AND materia_fecha_baja is NULL`,
            [id] 
        );

        if (resultados.length === 0) {
            const error = new Error('materia no encontrado.');
            error.status = 404;
            throw error;
        }

        const query = `
    UPDATE materias
    SET materia_fecha_baja = NOW(), materia_usuario_baja = ?
    WHERE materia_id = ?`;

        const result = await connection.query(query, [user_id, id]);

        if (result.affectedRows === 0) {
            const error = new Error('Materia no encontrada o ya dada de baja.');
            error.status = 404;
            throw error;
        }

        return {
            mensaje: `Materia con ID ${id} dado de baja correctamente.`,
            usuario_baja: user_id 
        };
    }

async getMateriaAlumnos(id) {

        const connection = await getConnection();

        const query = `
            SELECT
              u.user_id AS alumno_id,
              u.user_nombre AS alumno_nombre,  /* <-- ¡ESTA ES LA LÍNEA QUE FALTABA! */
              m.materia_id,
              m.materia_nombre
            FROM materias m
            INNER JOIN inscripciones i ON i.insc_materia_id = m.materia_id AND i.insc_fecha_baja IS NULL
            INNER JOIN usuarios u ON u.user_id = i.insc_alumno_id AND u.user_rol_id = 3 AND u.user_fecha_baja IS NULL
            WHERE m.materia_id = ?
        `;
        const result = await connection.query(query, [id]);

        if (result.length === 0) {
            const error = new Error('La materia no tiene alumnos inscriptos');
            error.status = 404;
            throw error;
        }

        return result
    }

}


module.exports = MateriaService;