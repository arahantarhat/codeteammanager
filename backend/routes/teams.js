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

// GET /api/equipos/:id/miembros
router.get('/equipos/:id/miembros', async (req, res) => {
  const equipoId = req.params.id;
  const db = await initDb();

  try {
    // Check if user has access (either student in team or creator)
    const isMember = await db.get(
      `SELECT 1 FROM usuarios_equipos WHERE usuario_id = ? AND equipo_id = ?`,
      [req.user.id, equipoId]
    );

    const isCreator = await db.get(
      `SELECT 1 FROM equipos WHERE id = ? AND creador_id = ?`,
      [equipoId, req.user.id]
    );

    if (!isMember && !isCreator) {
      return res.status(403).json({ message: 'No tienes acceso a este equipo' });
    }

    const miembros = await db.all(
      `SELECT u.id, u.nombre, u.apellido, u.email
       FROM usuarios u
       JOIN usuarios_equipos ue ON u.id = ue.usuario_id
       WHERE ue.equipo_id = ?`,
      [equipoId]
    );

    res.json({ miembros });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al obtener los miembros del equipo' });
  }
});


// DELETE /api/equipos/:id/miembros/:userId
router.delete('/equipos/:id/miembros/:userId', async (req, res) => {
  const equipoId = req.params.id;
  const userIdToRemove = req.params.userId;
  const db = await initDb();

  try {
    // Verify creator permission
    const isCreator = await db.get(
      `SELECT 1 FROM equipos WHERE id = ? AND creador_id = ?`,
      [equipoId, req.user.id]
    );

    if (!isCreator) {
      return res.status(403).json({ message: 'Solo el creador del equipo puede eliminar miembros' });
    }

    // Don't allow removing yourself
    if (req.user.id === parseInt(userIdToRemove)) {
      return res.status(400).json({ message: 'No puedes eliminarte a ti mismo' });
    }

    await db.run(
      `DELETE FROM usuarios_equipos WHERE usuario_id = ? AND equipo_id = ?`,
      [userIdToRemove, equipoId]
    );

    res.json({ message: 'Miembro eliminado del equipo' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al eliminar miembro' });
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

// PATCH /api/invitaciones/:id/aceptar
router.patch('/invitaciones/:id/aceptar', async (req, res) => {
  const inviteId = req.params.id;
  const db = await initDb();

  try {
    // Get invite and current user
    const invite = await db.get(
      `SELECT * FROM invitaciones WHERE id = ? AND estado = 'pendiente'`,
      inviteId
    );
    if (!invite || !invite.email) return res.status(404).json({ message: 'Invitación no encontrada' });

    const user = await db.get(`SELECT * FROM usuarios WHERE id = ?`, req.user.id);
    if (user.email !== invite.email)
      return res.status(403).json({ message: 'No tienes permiso para aceptar esta invitación' });

    // Add user to team
    await db.run(
      `INSERT INTO usuarios_equipos (usuario_id, equipo_id) VALUES (?, ?)`,
      req.user.id,
      invite.equipo_id
    );

    // Mark invitation as accepted
    await db.run(`UPDATE invitaciones SET estado = 'aceptada' WHERE id = ?`, inviteId);

    res.json({ message: 'Invitación aceptada' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al aceptar invitación' });
  }
});

// PATCH /api/invitaciones/:id/rechazar
router.patch('/invitaciones/:id/rechazar', async (req, res) => {
  const inviteId = req.params.id;
  const db = await initDb();

  try {
    const invite = await db.get(
      `SELECT * FROM invitaciones WHERE id = ? AND estado = 'pendiente'`,
      inviteId
    );
    if (!invite || !invite.email) return res.status(404).json({ message: 'Invitación no encontrada' });

    const user = await db.get(`SELECT * FROM usuarios WHERE id = ?`, req.user.id);
    if (user.email !== invite.email)
      return res.status(403).json({ message: 'No tienes permiso para rechazar esta invitación' });

    await db.run(`UPDATE invitaciones SET estado = 'rechazada' WHERE id = ?`, inviteId);

    res.json({ message: 'Invitación rechazada' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al rechazar invitación' });
  }
});

// POST /api/invitaciones — enviar invitación (solo teachers)
router.post('/invitaciones', async (req, res) => {
  const { email, equipo_id } = req.body;

  if (req.user.rol !== 'teacher') {
    return res.status(403).json({ message: 'Solo los profesores pueden enviar invitaciones' });
  }

  if (!email || !equipo_id) {
    return res.status(400).json({ message: 'Email y equipo requeridos' });
  }

  try {
    const db = await initDb();

    // Verificar que el equipo pertenece al profesor
    const team = await db.get(`SELECT * FROM equipos WHERE id = ? AND creador_id = ?`, [equipo_id, req.user.id]);
    if (!team) {
      return res.status(403).json({ message: 'No tienes permiso para invitar a este equipo' });
    }

    // Verificar si ya existe una invitación pendiente para ese email y equipo
    const existing = await db.get(
      `SELECT * FROM invitaciones WHERE email = ? AND equipo_id = ? AND estado = 'pendiente'`,
      [email, equipo_id]
    );
    if (existing) {
      return res.status(409).json({ message: 'Ya existe una invitación pendiente para este usuario' });
    }

    // Insertar nueva invitación
    await db.run(
      `INSERT INTO invitaciones (email, equipo_id) VALUES (?, ?)`,
      [email, equipo_id]
    );

    res.json({ message: 'Invitación enviada correctamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al enviar invitación' });
  }
});


export default router;
