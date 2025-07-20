import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import '/src/index.css';

import LoginPage from '/src/pages/login.jsx';
import Registro from '/src/pages/registro.jsx';
import Index from '/src/pages/index.jsx'; 

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/index" element={<Index />}/>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
