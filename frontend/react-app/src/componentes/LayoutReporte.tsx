import React from 'react';
import type { Carrera } from '../types/models/Carrera';

interface Props {
  asignatura: string;
  anio: number;
  docente: string;
  carrera: Carrera;
  children: React.ReactNode;
}

const LayoutReporte: React.FC<Props> = ({ asignatura, anio, docente, carrera, children }) => {
  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ marginBottom: '1rem', background: '#f0f0f0', padding: '1rem', borderRadius: '8px' }}>
        <strong>Asignatura:</strong> {asignatura} | <strong>Año:</strong> {anio} |{' '}
        <strong>Docente:</strong> {docente} | <strong>Carrera:</strong> {carrera.nombre}
      </div>
      {children}
    </div>
  );
};

export default LayoutReporte;