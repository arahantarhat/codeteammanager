import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { initDb } from '../db/db.js';

const router = express.Router();

// Registro
router.post('/register', async (req, res) => {
  const { nombre, apellido, email, password, rol } = req.body;

  try {
    const db = await initDb();
    const existing = await db.get('SELECT * FROM usuarios WHERE email = ?', email);
    if (existing)
      return res.status(400).json({ message: 'Email ya registrado' });

    const hashedPassword = await bcrypt.hash(password, 10);
    await db.run(
      'INSERT INTO usuarios (nombre, apellido, email, password, rol) VALUES (?, ?, ?, ?, ?)',
      nombre, apellido, email, hashedPassword, rol
    );

    res.json({ message: 'Usuario registrado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const db = await initDb();
    const user = await db.get('SELECT * FROM usuarios WHERE email = ?', email);

    if (!user)
      return res.status(400).json({ message: 'Credenciales inválidas' });

    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res.status(400).json({ message: 'Credenciales inválidas' });

    const token = jwt.sign(
      { id: user.id, rol: user.rol },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ token, user: { id: user.id, nombre: user.nombre, rol: user.rol } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
});

export default router;
