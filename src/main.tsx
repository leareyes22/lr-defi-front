import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { LrFront } from './LrFront.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LrFront />
  </StrictMode>
);
