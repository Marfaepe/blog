import mysql from 'mysql2/promise';

// Configuración de la conexión a la base de datos
const connection = await mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'blog'
});

console.log('Conectado a la base de datos.');

export default connection;
