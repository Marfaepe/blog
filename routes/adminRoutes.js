// routes/adminRoutes.js
import express from 'express';
import sqlite3 from 'sqlite';
import sqlite3Lib from 'sqlite3';
import path from 'path';



const router = express.Router();
const dbPromise = sqlite3.open({
    filename: path.resolve('blog.db'),
    driver: sqlite3Lib.Database
});

//Ruta para la pagina principal admin
router.get('/', async(req, res)=>{
    try{
        const db = await dbPromise;
        res.send('Página principal de administración');
    }catch(error){
        res.status(500).send('Error al acceder a la base de datos');
    }
});

//Ruta creación post
router.get('/create-post', (req, res)=>{
    res.send('Formulario para crear un nuevo post');
});

// Ruta para editar un post
router.get('/edit-post/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const db = await dbPromise;
        const post = await db.get('SELECT * FROM posts WHERE id = ?', [id]);
        if (post) {
            res.send(`Formulario para editar el post con id ${id}`);
        } else {
            res.status(404).send('Post no encontrado.');
        }
    } catch (error) {
        res.status(500).send('Error al acceder a la base de datos.');
    }
});

// Ruta para eliminar un post
router.get('/delete-post/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const db = await dbPromise;
        const post = await db.get('SELECT * FROM posts WHERE id = ?', [id]);
        if (post) {
            res.send(`Confirmación para eliminar el post con id ${id}`);
        } else {
            res.status(404).send('Post no encontrado.');
        }
    } catch (error) {
        res.status(500).send('Error al acceder a la base de datos.');
    }
});

export default router;