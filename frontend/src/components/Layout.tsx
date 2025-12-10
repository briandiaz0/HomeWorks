import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import './Layout.css';

const Layout: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path ? 'nav-link active' : 'nav-link';
  };

  return (
    <div className="layout">
      <header className="header">
        <div className="header-content">
          <h1 className="logo">
            <Link to="/">HomeWorks</Link>
          </h1>
          <nav className="nav">
            <Link to="/" className={isActive('/')}>
              Dashboard
            </Link>
            <Link to="/jobs" className={isActive('/jobs')}>
              Jobs
            </Link>
            <Link to="/clients" className={isActive('/clients')}>
              Clients
            </Link>
            <Link to="/job-types" className={isActive('/job-types')}>
              Job Types
            </Link>
          </nav>
        </div>
      </header>
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;