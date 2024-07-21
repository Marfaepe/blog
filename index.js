import express from 'express';
import session from 'express-session';
import pkg from 'sqlite3';
import nunjucks from 'nunjucks';
import path from 'path';
import homeRoutes from './routes/homeRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import authRoutes from './routes/authRoutes.js';


const app = express();
const port = 3000;

//Nunckucks
nunjucks.configure('views',{
    autoescape: true,
    express:app
})

//session express
app.use(session({
secret: 'Aqui va esta clave super secreta',
resave: false,
saveUninitialized:true

}));
// Analiza los cuerpos de las solicitudes con datos codificados en URL (como los formularios HTML)
app.use(express.urlencoded({ extended:true}));


// Rutas
app.use('/', homeRoutes);
app.use('/admin', adminRoutes);
app.use('/auth', authRoutes);

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
})