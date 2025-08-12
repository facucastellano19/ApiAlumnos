const getConnection = require('../db/mysql')
const bcrypt = require('bcrypt')
const { sign } = require('../utils/jwt')

class UsuarioService {
    async login(data) {
        const connection = await getConnection()

        const query = `
            SELECT user_id, user_nombre, user_rol_id, user_password
            FROM usuarios
            WHERE user_usuario = ? AND user_fecha_baja IS NULL
            LIMIT 1
        `;

        const users = await connection.query(query, [data.user])

        if (users[0]) {
            const { user_id, user_nombre, user_rol_id, user_password } = users[0];
            return bcrypt.compare(data.password, user_password)
                .then(sonIguales => {
                    if (sonIguales) {
                        const token = { token: sign({ user_id, user_nombre, user_rol_id }) } 
                        return { login: true, ...token }
                    } else {
                        const error = new Error('Datos de login incorrectos')
                        error.status = 401
                        throw error
                    }
                })
        } else {
            const error = new Error('Datos de login incorrectos');
            error.status = 401;
            throw error;
        }
    }

    async register(data) {
        const connection = await getConnection()
        const hash = await bcrypt.hash(data.password, 10) 
        const query = `
            INSERT INTO usuarios (user_nombre, user_email, user_usuario, user_password, user_rol_id, user_usuario_alta, user_fecha_alta)
            VALUES (?, ?, ?, ?, ? , ?, NOW())
        `;
        const valuesInsert = [
            data.nombre,
            data.email,
            data.usuario,
            hash,
            data.rol_id, 
            data.user_id 
        ];

        const result = await connection.query(query, valuesInsert)
        return {
            id: result.insertId,
            nombre: data.nombre,
            email: data.email,
            usuario: data.usuario,
            rol_id: data.rol_id,
            user_usuario_alta: data.user_id
        }
    }

}

module.exports = UsuarioService
