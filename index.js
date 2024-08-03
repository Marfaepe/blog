import express from 'express';
import session from 'express-session';
import nunjucks from 'nunjucks';
import multer from 'multer';
import db from './config/db.js'; // Importa la configuración de la base de datos

// Crear una instancia de Express
const app = express();

// Configuración de Nunjucks para plantillas
nunjucks.configure('views', {
  autoescape: true,
  express: app,
});

// Middleware para parsear el cuerpo de las peticiones
app.use(express.urlencoded({ extended: true }));

// Configuración de Multer para manejo de archivos
const upload = multer({ dest: 'uploads/' });

// Configuración de Express Session
app.use(session({
  secret: 'mi_secreto', // Cambia esto por una cadena secreta
  resave: false,
  saveUninitialized: true,
}));

// Ruta principal para obtener publicaciones
app.get('/', async (req, res) => {
  try {
    // Obtén las publicaciones de la base de datos
    const [posts] = await db.query(`
      SELECT p.id, p.title, p.content, u.username
      FROM posts p
      LEFT JOIN users u ON p.author_id = u.id
    `);

    // Renderiza la vista principal con las publicaciones
    res.render('index.njk', { posts });
  } catch (error) {
    console.error('Error al obtener las publicaciones:', error);
    res.status(500).send('Error al obtener las publicaciones');
  }
});

// Ruta para manejar la subida de archivos
app.post('/upload', upload.single('file'), (req, res) => {
    if (req.file) {
      res.send(`Archivo subido correctamente: ${req.file.originalname}`);
    } else {
      res.send('No se subió ningún archivo.');
    }
});

// Ruta para crear una nueva publicación
app.post('/create-post', upload.single('file'), async (req, res) => {
  const { title, content } = req.body;
  const file = req.file;

  try {
    // Inserta la publicación en la base de datos
    await db.query('INSERT INTO posts (title, content, file_path, author_id) VALUES (?, ?, ?, ?)', [title, content, file ? file.filename : null, 1]); // Cambia el ID del autor según sea necesario

    // Verifica si se subió un archivo
    if (file) {
      // Aquí puedes manejar el archivo si lo necesitas, por ejemplo, guardarlo en la base de datos o moverlo a otro directorio
      console.log(`Archivo subido: ${file.originalname}`);
    }

    res.redirect('/');
  } catch (error) {
    console.error('Error al crear la publicación:', error);
    res.status(500).send('Error al crear la publicación');
  }
});

// Ruta para mostrar el formulario de creación de publicaciones
app.get('/create-post', (req, res) => {
  res.render('create-post.njk'); // Asegúrate de que tienes esta vista en la carpeta 'views'
});

// Puerto en el que el servidor escuchará
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
