const mysql = require('promise-mysql')
require('dotenv').config()

const dbconfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
}

let connection;

async function handleConnection() {
    try {
        // Intenta crear la conexión
        connection = await mysql.createConnection(dbconfig);
        console.log('Conexión a la DB establecida correctamente.');

        // Escucha eventos de error en la conexión
        connection.on('error', async (err) => {
            console.error('[DB Error]', err.message);
            // Si se pierde la conexión, intenta reconectar
            if (err.code === 'PROTOCOL_CONNECTION_LOST') {
                console.log('Conexión perdida. Intentando reconectar...');
                await handleConnection();
            } else {
                throw err;
            }
        });
    } catch (err) {
        // Si la conexión inicial falla (ej. ECONNREFUSED)
        console.error('Error al conectarse a la DB:', err.message);
        console.log('Reintentando conexión en 2 segundos...');
        // Espera 2 segundos y vuelve a intentarlo
        setTimeout(handleConnection, 2000);
    }
}

// Inicia el proceso de conexión
handleConnection();

// La función que usan los servicios sigue devolviendo la conexión
module.exports = async () => {
    // Devuelve la conexión que `handleConnection` mantiene viva
    return connection;
};