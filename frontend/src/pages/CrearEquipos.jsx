import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const CrearEquipo = () => {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) return;
    const parsed = JSON.parse(storedUser);
    if (parsed.rol !== 'teacher') {
      alert('Acceso denegado');
      navigate('/');
    } else {
      setUser(parsed);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    try {
      const res = await fetch('/api/equipos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ nombre, descripcion })
      });

      const data = await res.json();
      if (res.ok) {
        alert('Equipo creado exitosamente');
        navigate('/index');
      } else {
        alert(data.message || 'Error al crear equipo');
      }
    } catch (err) {
      alert('Error al conectar con el servidor');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1>Crear Nuevo Equipo</h1>
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="text"
            placeholder="Nombre del equipo"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
            style={styles.input}
          />
          <textarea
            placeholder="Descripción del equipo"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            style={{ ...styles.input, height: '100px' }}
          />
          <button type="submit" style={styles.button}>Crear</button>
        </form>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: 'linear-gradient(135deg, #43cea2, #185a9d)',
    padding: '40px'
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    padding: '40px',
    maxWidth: '500px',
    width: '100%',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
    color: '#213547'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    marginTop: '20px'
  },
  input: {
    padding: '10px',
    fontSize: '16px',
    borderRadius: '6px',
    border: '2px solid #ccc'
  },
  button: {
    padding: '12px',
    backgroundColor: '#667eea',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '16px'
  }
};

export default CrearEquipo;
