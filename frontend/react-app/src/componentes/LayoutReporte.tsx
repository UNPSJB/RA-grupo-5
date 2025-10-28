import React from 'react';

interface Props {
  asignatura: string;
  anio: number;
  docente: string;
  carrera: string;
  children: React.ReactNode;
}

const LayoutReporte: React.FC<Props> = ({ asignatura, anio, docente, carrera, children }) => {
  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ marginBottom: '1rem', background: '#f0f0f0', padding: '1rem', borderRadius: '8px' }}>
        <strong>Asignatura:</strong> {asignatura} | <strong>Año:</strong> {anio} |{' '}
        <strong>Docente:</strong> {docente} | <strong>Carrera:</strong> {carrera}
      </div>
      {children}
    </div>
  );
};

export default LayoutReporte;