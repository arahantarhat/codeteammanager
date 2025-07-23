import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import NavBar from '/src/components/NavBar.jsx';

const VerEquipo = () => {
  const { id } = useParams(); // equipo ID from URL
  const [miembros, setMiembros] = useState([]);
  const [user, setUser] = useState(null);
  const [esCreador, setEsCreador] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    if (!storedUser || !token) {
      navigate('/');
      return;
    }

    const parsed = JSON.parse(storedUser);
    setUser(parsed);

    // Fetch miembros
    fetch(`/api/equipos/${id}/miembros`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data.message) {
          alert(data.message);
          navigate('/index');
        } else {
          setMiembros(data.miembros);
          setEsCreador(parsed.rol === 'teacher');
        }
      })
      .catch(() => {
        alert('Error al cargar los miembros');
        navigate('/index');
      });
  }, [id, navigate]);

  const handleEliminar = async (userId) => {
    const token = localStorage.getItem('token');
    const confirm = window.confirm('¿Estás seguro de que deseas eliminar este miembro?');
    if (!confirm) return;

    try {
      const res = await fetch(`/api/equipos/${id}/miembros/${userId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        alert(data.message);
        setMiembros(prev => prev.filter(m => m.id !== userId));
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert('Error al eliminar miembro');
    }
  };

  return (
    <>
      <NavBar />
      <div style={styles.container}>
        <div style={styles.card}>
          <h2>Miembros del equipo</h2>
          {miembros.length === 0 ? (
            <p>No hay miembros en este equipo.</p>
          ) : (
            <ul>
              {miembros.map((m) => (
                <li key={m.id} style={styles.item}>
                  {m.nombre} {m.apellido} ({m.email})
                  {esCreador && user.id !== m.id && (
                    <button onClick={() => handleEliminar(m.id)} style={styles.removeBtn}>
                      Eliminar
                    </button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  );
};

const styles = {
  container: {
    paddingTop: '80px',
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
    padding: '30px',
    maxWidth: '600px',
    width: '100%',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
    color: '#213547'
  },
  item: {
    marginBottom: '12px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  removeBtn: {
    backgroundColor: '#e53e3e',
    color: 'white',
    border: 'none',
    padding: '6px 12px',
    borderRadius: '6px',
    cursor: 'pointer'
  }
};

export default VerEquipo;
