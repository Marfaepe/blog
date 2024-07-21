import {  Database } from 'sqlite3';

//Crear una instancia en la base de datos
const db = new Database('blod.db');

export const getHome = (req, res)=>{
    
    db.all("SELECT posts.*, users.username FROM posts JOIN users ON posts.author_id = users.id", (err, rows) => {
        if (err) {
            return res.status(500).send('Error al obtener las publicaciones');
        }
        res.render('index.njk', { posts: rows });
    });
};