import React from 'react';
import { Tabs, Typography } from 'antd';
import styled from 'styled-components';
import MenuManager from '../components/admin/MenuManager.jsx';
import OrderManager from '../components/admin/OrderManager.jsx';
import AnalyticsDashboard from '../components/admin/AnalyticsDashboard.jsx';

const PanelBox = styled.div`
  max-width: 1100px;
  margin: 2rem auto;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  padding: 2rem;
`;

function AdminPanel() {
  return (
    <PanelBox>
      <Typography.Title level={3}>Admin Panel</Typography.Title>
      <Tabs
        defaultActiveKey="menu"
        items={[
          {
            key: 'menu',
            label: 'Menu Management',
            children: <MenuManager />,
          },
          {
            key: 'orders',
            label: 'Orders & Payments',
            children: <OrderManager />,
          },
          {
            key: 'analytics',
            label: 'Analytics',
            children: <AnalyticsDashboard />,
          },
        ]}
      />
    </PanelBox>
  );
}

export default AdminPanel; 