import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import '/src/index.css';

import LoginPage from '/src/pages/login.jsx';
import Registro from '/src/pages/registro.jsx';
import Index from '/src/pages/index.jsx'; 
import CrearEquipo from '/src/pages/CrearEquipos.jsx';
import VerEquipo from '/src/pages/VerEquipo.jsx';


createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/index" element={<Index />}/>
        <Route path="/crear-equipo" element={<CrearEquipo />} />
        <Route path="/equipo/:id" element={<VerEquipo />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
