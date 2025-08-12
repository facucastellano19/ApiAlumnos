const getConnection = require('../db/mysql');

class InscripcionService {

    async postInscripcion(data) {
        const {
            alumno_id,
            materia_id,
            usuario_alta = data.user_id 
        } = data;

        try {

            const connection = await getConnection();

            const query = `
              INSERT INTO inscripciones
                (insc_alumno_id, insc_materia_id, insc_usuario_alta, insc_fecha_alta)
              VALUES (?, ?, ?, NOW())
            `;

            const result = await connection.query(query, [
                alumno_id,
                materia_id,
                usuario_alta
            ]);

            return {
                id: result.insertId, 
                alumno_id,
                materia_id,
                usuario_alta
            };

        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                const customError = new Error('Ya existe un alumno inscripto en esa materia.');
                customError.status = 400;
                throw customError;
            }
            if (error.code === 'ER_NO_REFERENCED_ROW_2') {
                const customError = new Error('Alumno o materia no existe.');
                customError.status = 400;
                throw customError;
            }
            throw error; 
        }
    }

    async deleteInscripcion(id, user_id) {
        try {
            const connection = await getConnection();

            const query = `
                UPDATE inscripciones
                SET insc_fecha_baja = NOW(), insc_usuario_baja = ?
                WHERE insc_id = ? and insc_fecha_baja is NULL`;

            const result = await connection.query(query, [user_id, id]);

            if (result.affectedRows === 0) {
                const error = new Error('Inscripcion no encontrada o ya dada de baja.');
                error.status = 404;
                throw error;
            }
            return {
                mensaje: `Inscripcion con ID ${id} dada de baja correctamente.`,
                usuario_baja: user_id
            };

        } catch (error) {
            throw error;
        }

    }

    async getInscripcionById(id) {
        const connection = await getConnection();

        const query = `
      SELECT insc_alumno_id as alumno_id FROM inscripciones
      WHERE insc_id = ? AND insc_fecha_baja IS NULL
      LIMIT 1
    `;

        const resultados = await connection.query(query, [id]);

        if (resultados.length === 0) {
            return null; 
        }

        return resultados[0];
    }

}

module.exports = InscripcionService;
