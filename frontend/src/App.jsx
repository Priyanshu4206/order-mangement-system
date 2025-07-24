import React from 'react';
import { Routes, Route, Link, Navigate, useLocation, useParams } from 'react-router-dom';
import styled, { createGlobalStyle } from 'styled-components';
import 'antd/dist/reset.css';
import CustomerPage from './pages/CustomerPage.jsx';
import KitchenDashboard from './pages/KitchenDashboard.jsx';
import AdminPanel from './pages/AdminPanel.jsx';
import LoginPage from './pages/LoginPage.jsx';
import CataloguePage from './pages/CataloguePage.jsx';
import useStore from './store';

const Container = styled.div`
  min-height: 100vh;
  background: #f8f9fa;
  font-family: 'Segoe UI', sans-serif;
`;

const Nav = styled.nav`
  display: flex;
  gap: 1rem;
  padding: 1rem;
  background: #fff;
  border-bottom: 1px solid #eee;
`;

const GlobalStyle = createGlobalStyle`
  body { background: #f8f9fa; }
`;

function RequireAuth({ children, role }) {
  const isAuthenticated = useStore(state => state.isAuthenticated());
  const user = useStore(state => state.user);
  const location = useLocation();
  if (!isAuthenticated) return <Navigate to="/login" state={{ from: location }} replace />;
  if (role && user?.role !== role) return <Navigate to="/login" state={{ from: location }} replace />;
  return children;
}

function App() {
  const isAuthenticated = useStore(state => state.isAuthenticated());
  const user = useStore(state => state.user);
  const logout = useStore(state => state.logout);
  const location = useLocation();
  const showNav = location.pathname === '/admin';

  return (
    <Container>
      <GlobalStyle />
      {showNav && isAuthenticated && (
        <Nav>
          <span style={{ marginLeft: 'auto' }}>
            Logged in as: {user?.email} ({user?.role})
          </span>
          <button onClick={logout} style={{ marginLeft: 16 }}>Logout</button>
        </Nav>
      )}
      <Routes>
        <Route path="/" element={<CataloguePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/kitchen" element={
          <RequireAuth role="kitchen">
            <KitchenDashboard />
          </RequireAuth>
        } />
        <Route path="/admin" element={
          <RequireAuth role="admin">
            <AdminPanel />
          </RequireAuth>
        } />
        <Route path="/table/:tableId" element={<CustomerPage />} />
      </Routes>
    </Container>
  );
}

export default App; 