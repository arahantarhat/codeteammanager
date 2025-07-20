import express from 'express';
import { initDb } from '../db/db.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Middleware to authenticate and attach user info
router.use((req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: 'No token provided' });

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, rol }
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Token inválido' });
  }
});


// POST /api/equipos — Crear nuevo equipo (solo profesores)
router.post('/equipos', async (req, res) => {
  const { nombre, descripcion } = req.body;

  if (req.user.rol !== 'teacher') {
    return res.status(403).json({ message: 'Solo los profesores pueden crear equipos' });
  }

  if (!nombre) {
    return res.status(400).json({ message: 'Nombre del equipo requerido' });
  }

  try {
    const db = await initDb();
    await db.run(
      `INSERT INTO equipos (nombre, descripcion, creador_id)
       VALUES (?, ?, ?)`,
      nombre,
      descripcion || '',
      req.user.id
    );

    res.json({ message: 'Equipo creado exitosamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al crear el equipo' });
  }
});


// GET /api/mis-equipos
router.get('/mis-equipos', async (req, res) => {
  try {
    const db = await initDb();

    let equipos = [];

    if (req.user.rol === 'student') {
      equipos = await db.all(
        `SELECT e.id, e.nombre
         FROM equipos e
         JOIN usuarios_equipos ue ON ue.equipo_id = e.id
         WHERE ue.usuario_id = ?`,
        req.user.id
      );
    } else if (req.user.rol === 'teacher') {
      equipos = await db.all(
        `SELECT id, nombre FROM equipos WHERE creador_id = ?`,
        req.user.id
      );
    }

    res.json({ equipos });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al obtener los equipos' });
  }
});

// GET /api/mis-invitaciones
router.get('/mis-invitaciones', async (req, res) => {
  if (req.user.rol !== 'student') {
    return res.status(403).json({ message: 'Solo los estudiantes pueden ver invitaciones' });
  }

  try {
    const db = await initDb();
    const invites = await db.all(
      `SELECT i.id, i.email, i.estado, e.nombre AS equipo
       FROM invitaciones i
       JOIN equipos e ON i.equipo_id = e.id
       WHERE i.email = (SELECT email FROM usuarios WHERE id = ?)
         AND i.estado = 'pendiente'`,
      req.user.id
    );

    res.json({ invitaciones: invites });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al obtener invitaciones' });
  }
});

export default router;
