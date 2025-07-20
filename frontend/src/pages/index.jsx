import React, { useState, useEffect } from 'react';

const Index = () => {
  // TODO: Replace with actual user data from backend or context
  const [user, setUser] = useState({
    nombre: 'Juan',
    rol: 'teacher' // or 'student'
  });

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1>Bienvenido, {user.nombre}</h1>

        {user.rol === 'teacher' && (
          <>
            <h2>Equipos que gestionas</h2>
            <TeamList teams={['Equipo A', 'Equipo B']} />
            <InviteForm teams={['Equipo A', 'Equipo B']} />

          </>
        )}

        {user.rol === 'student' && (
          <>
            <h2>Tus Equipos</h2>
            <TeamList teams={['Equipo A', 'Equipo X']} />
            <PendingInvites invites={['Invitación de Equipo B']} />
          </>
        )}
      </div>
    </div>
  );
};

const TeamList = ({ teams }) => (
  <ul>
    {teams.map((team, idx) => (
      <li key={idx}>{team}</li>
    ))}
  </ul>
);

const InviteForm = ({ teams }) => {
  const [email, setEmail] = useState('');
  const [selectedTeam, setSelectedTeam] = useState(teams[0] || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedTeam) {
      alert('Selecciona un equipo');
      return;
    }
    alert(`Invitación enviada a ${email} para el equipo ${selectedTeam}`);
    setEmail('');
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <select
        value={selectedTeam}
        onChange={(e) => setSelectedTeam(e.target.value)}
        style={styles.select}
        required
      >
        {teams.map((team, idx) => (
          <option key={idx} value={team}>{team}</option>
        ))}
      </select>

      <input
        type="email"
        placeholder="Correo del estudiante"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={styles.input}
        required
      />
      <button type="submit" style={styles.button}>Invitar</button>
    </form>
  );
};


const PendingInvites = ({ invites }) => (
  <ul>
    {invites.map((invite, idx) => (
      <li key={idx}>{invite}</li>
    ))}
  </ul>
);

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
    color: '#213547',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)'
  },
  form: {
    display: 'flex',
    gap: '10px',
    marginTop: '20px'
  },
  input: {
    flex: 1,
    padding: '10px',
    borderRadius: '6px',
    border: '2px solid #ccc'
  },
  button: {
    padding: '10px 20px',
    backgroundColor: '#667eea',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer'
  },
  select: {
  padding: '10px',
  borderRadius: '6px',
  border: '2px solid #ccc',
  fontSize: '14px'
}

};

export default Index;
