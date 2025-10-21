const express = require('express');
const alumnoRouter = require('./src/routers/alumnoRouter');
const usuarioRouter = require('./src/routers/usuarioRouter')
const materiaRouter = require('./src/routers/materiaRouter');
const inscripcionRouter = require('./src/routers/inscripcionRouter');
const { errorHandler, logError } = require('./src/middlewares/error.handler');

const app = express();
app.use(express.json());

app.use('/api/alumnos', alumnoRouter);
app.use('/api/usuario', usuarioRouter);
app.use('/api/materias', materiaRouter);
app.use('/api/inscripciones', inscripcionRouter);


app.get('/', (req, res) => {
  res.send('Servidor gestión de alumnos con login');
});

app.use(logError);
app.use(errorHandler);


const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
