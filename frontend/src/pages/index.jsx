import React, { useState, useEffect } from 'react';
import NavBar from '/src/components/NavBar.jsx';
import { Link } from 'react-router-dom';

const Index = () => {
  const [user, setUser] = useState(null);
  const [teams, setTeams] = useState([]);
  const [invites, setInvites] = useState([]);

  useEffect(() => {
  const storedUser = localStorage.getItem('user');
  const token = localStorage.getItem('token');

  if (!storedUser || !token) return;

  const parsed = JSON.parse(storedUser);
  setUser(parsed);

  // Fetch teams
  fetch('/api/mis-equipos', {
    headers: { Authorization: `Bearer ${token}` }
  })
    .then(res => res.json())
    .then(data => setTeams(data.equipos || []))
    .catch(err => console.error('Error al cargar equipos:', err));

  // Fetch invites if student
  if (parsed.rol === 'student') {
    fetch('/api/mis-invitaciones', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setInvites(data.invitaciones || []))
      .catch(err => console.error('Error al cargar invitaciones:', err));
  }
}, []);


  if (!user) {
    return <p style={{ color: 'white' }}>Cargando usuario...</p>;
  }

  return (
    <>
    <NavBar />
    <div style={styles.container}>
      <div style={styles.card}>
        <h1>Bienvenido, {user.nombre}</h1>

        {user.rol === 'student' && (
          <>
            <h2 style={styles.heading}>Tus Equipos</h2>
            <TeamList teams={teams} />

            <h2 style={styles.heading}>Invitaciones Pendientes</h2>
            <PendingInvites invites={invites} />
          </>
        )}

        {user.rol === 'teacher' && (
            <>
                <h2 style={styles.heading}>Equipos que gestionas</h2>
                <TeamList teams={teams} />

                <button
                onClick={() => window.location.href = '/crear-equipo'}
                style={{ ...styles.linkButton, marginBottom: '20px' }}
                >
                Crear nuevo equipo
                </button>

                <h2 style={styles.heading}>Invitar a un estudiante</h2>
                <InviteForm teams={teams} />
            </>
        )}

      </div>
    </div>
    </>
  );
};

const TeamList = ({ teams }) => (
  <ul>
    {teams.length === 0 ? (
      <li>No hay equipos</li>
    ) : (
      teams.map((team) => (
        <li key={team.id}>
          <Link to={`/equipo/${team.id}`} style={{ color: '#667eea', fontWeight: 'bold' }}>
            {team.nombre}
          </Link>
        </li>
      ))
    )}
  </ul>
);

const PendingInvites = ({ invites }) => {
  const token = localStorage.getItem('token');

  const handleInviteAction = async (id, action) => {
    try {
      const res = await fetch(`/api/invitaciones/${id}/${action}`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      alert(data.message);
      location.reload();
    } catch (err) {
      alert('Error al procesar la invitación');
    }
  };

  return (
    <ul>
      {invites.length === 0 ? (
        <li>No tienes invitaciones pendientes</li>
      ) : (
        invites.map((invite) => (
          <li key={invite.id} style={{ marginBottom: '10px' }}>
            {invite.equipo}
            <div style={{ marginTop: '5px' }}>
              <button onClick={() => handleInviteAction(invite.id, 'aceptar')} style={styles.smallBtn}>Aceptar</button>
              <button onClick={() => handleInviteAction(invite.id, 'rechazar')} style={styles.smallBtn}>Rechazar</button>
            </div>
          </li>
        ))
      )}
    </ul>
  );
};


const InviteForm = ({ teams }) => {
  const [email, setEmail] = useState('');
  const [selectedTeam, setSelectedTeam] = useState(teams[0] || '');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedTeam) {
      alert('Selecciona un equipo');
      return;
    }

    const token = localStorage.getItem('token');

    try {
    const res = await fetch('/api/invitaciones', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
        email,
        equipo_id: selectedTeam
        })
    });

    const data = await res.json();
    if (res.ok) {
        alert(data.message);
        setEmail('');
    } else {
        alert(data.message || 'Error al enviar la invitación');
    }
    } catch (err) {
    alert('Error de red al enviar la invitación');
    }

  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <select
        value={selectedTeam}
        onChange={(e) => setSelectedTeam(e.target.value)}
        style={styles.select}
      >
        {teams.map((team, idx) => (
          <option key={team.id} value={team.id}>{team.nombre}</option>
        ))}
      </select>
      <input
        type="email"
        placeholder="Correo del estudiante"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        style={styles.input}
      />
      <button type="submit" style={styles.button}>
        Invitar
      </button>
    </form>
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
    maxWidth: '600px',
    width: '100%',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
    color: '#213547'
  },
  heading: {
    marginTop: '20px'
  },
  form: {
    display: 'flex',
    gap: '10px',
    marginTop: '20px'
  },
  select: {
    padding: '10px',
    borderRadius: '6px',
    border: '2px solid #ccc',
    fontSize: '14px'
  },
  input: {
    flex: 1,
    padding: '10px',
    borderRadius: '6px',
    border: '2px solid #ccc',
    fontSize: '14px'
  },
  button: {
    padding: '10px 20px',
    backgroundColor: '#667eea',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer'
  },
  linkButton: {
  display: 'inline-block',
  backgroundColor: '#228f40',
  color: 'white',
  padding: '10px 20px',
  borderRadius: '6px',
  textDecoration: 'none',
  fontWeight: 'bold',
  marginBottom: '20px'
},
smallBtn: {
  marginRight: '8px',
  padding: '5px 10px',
  fontSize: '12px',
  backgroundColor: '#667eea',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer'
}


};

export default Index;
