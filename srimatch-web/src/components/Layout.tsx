"use client";

import React from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from './Navbar';

/* ─── Styles ─────────────────────────────────────────────────────────────── */
const styles = `
  .layout-root {
    min-height: 100vh;
    background: #fdf8f4;
    font-family: var(--font-dm-sans), sans-serif;
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

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();

  return (
    <>
      <style>{styles}</style>
      <div className="layout-root">
        <Navbar />
        <main className="layout-main">
          <div className="layout-inner">
            {children}
          </div>
        </main>
      </div>
    </>
  );
};

export default Layout;