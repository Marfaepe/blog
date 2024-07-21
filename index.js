import express from 'express';
import session from 'express-session';
import pkg from 'sqlite3';
import nunjucks from 'nunjucks';
import path from 'path';
import bcrypt from 'bcryptjs';  // Añade esta línea

const { Database } = pkg;
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

const db = new Database('blog.db');

db.serialize(() => {
    db.run("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, username TEXT, password TEXT)");
    db.run("CREATE TABLE IF NOT EXISTS posts (id INTEGER PRIMARY KEY, title TEXT, content TEXT, author_id INTEGER, FOREIGN KEY(author_id) REFERENCES users(id))");
});