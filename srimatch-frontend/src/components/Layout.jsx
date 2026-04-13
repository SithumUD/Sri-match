import React from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from './Navbar';

/* ─── Styles ─────────────────────────────────────────────────────────────── */
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,300;1,400;1,600&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');

  .layout-root {
    min-height: 100vh;
    background: #fdf8f4;
    font-family: 'DM Sans', sans-serif;
    color: #2d1810;
  }

  /* Subtle warm texture overlay */
  .layout-root::before {
    content: '';
    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: 0;
    background:
      radial-gradient(ellipse 80% 50% at 10% 0%, rgba(232,201,122,0.055) 0%, transparent 60%),
      radial-gradient(ellipse 60% 40% at 90% 100%, rgba(244,160,160,0.04) 0%, transparent 55%);
  }

  .layout-main {
    position: relative;
    z-index: 1;
    padding: 2rem 1.5rem 4rem;
  }

  .layout-inner {
    max-width: 1200px;
    margin: 0 auto;
  }

  @media (max-width: 600px) {
    .layout-main {
      padding: 1.25rem 1rem 3rem;
    }
  }
`;

const Layout = () => {
  const { user } = useAuth();

  return (
    <>
      <style>{styles}</style>
      <div className="layout-root">
        <Navbar />
        <main className="layout-main">
          <div className="layout-inner">
            <Outlet />
          </div>
        </main>
      </div>
    </>
  );
};

export default Layout;