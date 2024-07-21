import express from 'express';
import { getHome } from '../controlled/homeController.js';

const router = express.Router();

//Ruta de la página principañ
router.get('/', getHome);

export default router;