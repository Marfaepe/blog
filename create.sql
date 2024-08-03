-- Crear la base de datos si no existe
CREATE DATABASE IF NOT EXISTS blog;

-- Usar la base de datos
USE blog;

-- Crear la tabla de usuarios
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL
);

-- Crear la tabla de artículos
CREATE TABLE IF NOT EXISTS posts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  author_id INT,
  FOREIGN KEY (author_id) REFERENCES users(id)
);
