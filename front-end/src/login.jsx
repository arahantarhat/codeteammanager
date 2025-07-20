import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = 'El email es obligatorio';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email inválido';
    if (!formData.password) newErrors.password = 'La contraseña es obligatoria';
    else if (formData.password.length < 6) newErrors.password = 'Mínimo 6 caracteres';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('http://localhost:3000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();

      if (res.ok) {
        alert('Inicio de sesión exitoso');
        // localStorage.setItem('token', data.token);
      } else {
        setErrors({ password: data.message });
      }
    } catch (error) {
      alert('Error de conexión con el servidor');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.loginCard}>
        <div style={styles.header}>
          <h1 style={styles.title}>CodeTeam</h1>
          <p style={styles.subtitle}>Inicia sesión en tu cuenta</p>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              style={{ ...styles.input, ...(errors.email ? styles.inputError : {}) }}
              placeholder="correo@example.com"
            />
            {errors.email && <span style={styles.errorText}>{errors.email}</span>}
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Contraseña</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              style={{ ...styles.input, ...(errors.password ? styles.inputError : {}) }}
              placeholder="******"
            />
            {errors.password && <span style={styles.errorText}>{errors.password}</span>}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            style={{
              ...styles.submitButton,
              ...(isLoading ? styles.submitButtonDisabled : {})
            }}
          >
            {isLoading ? 'Ingresando...' : 'Iniciar sesión'}
          </button>
        </form>

        <div style={styles.footer}>
          <p style={styles.footerText}>
            ¿No tienes cuenta? <Link to="/registro" style={styles.signupLink}>Regístrate</Link>
          </p>
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
  title: { fontSize: '30px', fontWeight: 'bold', margin: 0 },
  subtitle: { fontSize: '16px', color: '#555' },
  form: { display: 'flex', flexDirection: 'column', gap: '20px' },
  inputGroup: { display: 'flex', flexDirection: 'column' },
  label: { fontSize: '14px', fontWeight: 'bold' },
  input: {
    padding: '12px',
    fontSize: '16px',
    borderRadius: '6px',
    border: '2px solid #e2e8f0'
  },
  inputError: {
    borderColor: '#e53e3e'
  },
  errorText: {
    color: '#e53e3e',
    fontSize: '13px',
    marginTop: '4px'
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
  submitButtonDisabled: {
    backgroundColor: '#a0aec0',
    cursor: 'not-allowed'
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

export default LoginPage;
