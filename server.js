import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { pool } from './db.js';
import { PORT } from './config.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Obtener todos los contactos
app.get('/api/contacts', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT id, name, phone FROM contacts');
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener contactos' });
  }
});

// Agregar contacto
app.post('/api/contacts', async (req, res) => {
  const { name, phone } = req.body;
  if (!name || !phone) {
    return res.status(400).json({ error: 'Faltan campos requeridos' });
  }
  try {
    const [result] = await pool.query('INSERT INTO contacts (name, phone) VALUES (?, ?)', [name, phone]);
    res.status(201).json({ id: result.insertId, name, phone });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al agregar contacto' });
  }
});

// Eliminar contacto
app.delete('/api/contacts/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM contacts WHERE id = ?', [id]);
    res.json({ message: 'Contacto eliminado' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al eliminar contacto' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
