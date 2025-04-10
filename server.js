const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

// Configuración de middlewares
app.use(bodyParser.json());
app.use(session({
    secret: 'clave_secreta_para_la_sesion',
    resave: false,
    saveUninitialized: true
}));

// Importar rutas
const authRoutes = require('./routes/auth');
const postsRoutes = require('./routes/posts');

// Montar rutas
app.use('/auth', authRoutes);
app.use('/posts', postsRoutes);

app.listen(port, () => {
    console.log(`Servidor en ejecución en http://localhost:${port}`);
});
