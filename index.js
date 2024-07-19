import express from 'express';
import session from 'express-session';
import pkg from 'sqlite3';
import nunjucks from 'nunjucks';
import path from 'path';

const { Database } = pkg;

const app = express();
const port = 3000;

nunjucks.configure('views', {
    autoescape: true,
    express: app
})

app.use(session({
    secret: 'Esta es una clave super secreta',
    resave: false,
    saveUninitialized: true
}));


app.use(express.urlencoded({ extended: true }));

const db = new Database('blog.db');

db.serialize(() => {
    db.run("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, username TEXT, password TEXT)");
    db.run("CREATE TABLE IF NOT EXISTS posts (id INTEGER PRIMARY KEY, title TEXT, content TEXT, author_id INTEGER, FOREIGN KEY(author_id) REFERENCES users(id))");

})

app.get('/', (req, res) => {
    db.all("SELECT posts.*, users.username FROM posts JOIN users ON posts.author_id = users.id", (err, rows) => {
        if (err) {
            return res.status(500).send('Error al obtener las publicaciones');
        }
        res.render('index.nkj', { posts: rows });
    });
});

app.get('/register', (req, res) => {
    res.render('register.njk');
});

app.post('/register', (req, res) => {
    const { username, password } = req.body;

    bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) {
            return res.status(500).send('Error al hashear la contraseña');
        }

        db.run("INSERT INTO users (username, password) VALUES (?, ?)", [username, hashedPassword], function (err) {
            if (err) {
                return res.status(500).send('Error al registrar el usuario.')
            }
            res.send("Usuario registrado con éxito. <a href='/login'>Iniciar sesión</a>");
        });

    });
});



// Ruta de inicio para mostrar publicaciones
app.get('/', (req, res) => {
    db.all("SELECT posts.*, users.username FROM posts JOIN users ON posts.author_id = users.id", (err, rows) => {
      if (err) {
        return res.status(500).send("Error al obtener las publicaciones.");
      }
      res.render('index.njk', { posts: rows });
    });
  });



app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});