import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Registro = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    password: '',
    rol: ''
  });
  const [mensaje, setMensaje] = useState('');
  const navigate = useNavigate();
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      setMensaje(data.message || 'Registro exitoso');
      navigate('/');

    } catch (error) {
      setMensaje('Error al registrar usuario');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.loginCard}>
        <div style={styles.header}>
          <h1 style={styles.title}>CodeTeam Manager</h1>
          <p style={styles.subtitle}>Crea una cuenta nueva</p>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Nombre</label>
            <input name="nombre" placeholder='Nombre' onChange={handleChange} required style={styles.input} />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Apellido</label>
            <input name="apellido" placeholder='Apellido' onChange={handleChange} required style={styles.input} />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Correo</label>
            <input type="email" name="email" placeholder='e-mail' onChange={handleChange} required style={styles.input} />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Contraseña</label>
            <input type="password" name="password" placeholder='Contrasena' onChange={handleChange} required style={styles.input} />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Rol</label>
            <select name="rol" onChange={handleChange} required style={styles.input}>
              <option value="">Selecciona un rol</option>
              <option value="teacher">Profesor</option>
              <option value="student">Estudiante</option>
            </select>
          </div>

          <button type="submit" style={styles.submitButton}>Registrar</button>
        </form>

        <div style={styles.footer}>
          <p style={styles.footerText}>
            ¿Ya tienes cuenta? <Link to="/" style={styles.signupLink}>Inicia sesión</Link>
          </p>
          {mensaje && <p style={{ marginTop: '1rem', color: '#333' }}>{mensaje}</p>}
        </div>
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
    background: 'linear-gradient(135deg, #667eea, #764ba2)',
    padding: '40px'
  },
  loginCard: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    padding: '50px',
    width: '100%',
    maxWidth: '450px',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)'
  },
  header: { textAlign: 'center', marginBottom: '30px' },
  title: { fontSize: '30px', color:'black', fontWeight: 'bold', margin: 0 },
  subtitle: { fontSize: '16px', color: '#555' },
  form: { display: 'flex', flexDirection: 'column', gap: '20px' },
  inputGroup: { display: 'flex', flexDirection: 'column' },
  label: { fontSize: '14px', fontWeight: 'bold', color:'black'},
  input: {
    padding: '12px',
    fontSize: '16px',
    borderRadius: '6px',
    border: '2px solid #e2e8f0'
  },
  submitButton: {
    backgroundColor: '#667eea',
    color: '#fff',
    fontSize: '16px',
    padding: '12px',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer'
  },
  footer: {
    textAlign: 'center',
    marginTop: '25px'
  },
  footerText: {
    fontSize: '14px',
    color: '#555'
  },
  signupLink: {
    color: '#667eea',
    textDecoration: 'none',
    fontWeight: 'bold'
  }
};

export default Registro;
