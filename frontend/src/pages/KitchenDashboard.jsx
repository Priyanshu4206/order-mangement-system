import React, { useEffect, useState } from 'react';
import { Table, Tag, Button, message, Typography } from 'antd';
import styled from 'styled-components';
import { fetchOrders, updateOrderStatus as apiUpdateOrderStatus } from '../api';
import useStore from '../store';

const DashboardBox = styled.div`
  max-width: 1100px;
  margin: 2rem auto;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  padding: 2rem;
`;

const statusColors = {
  pending: 'orange',
  in_progress: 'blue',
  ready: 'green',
  completed: 'default',
};

function KitchenDashboard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const token = useStore(state => state.token);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const resp = await fetchOrders();
      setOrders(resp.data);
    } catch (err) {
      message.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadOrders(); }, []);

  const handleStatusChange = async (id, status) => {
    try {
      await apiUpdateOrderStatus(id, status, token);
      message.success('Order status updated');
      loadOrders();
    } catch (err) {
      message.error('Failed to update status');
    }
  };

  const columns = [
    {
      title: 'Order ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: 'Table',
      dataIndex: 'tableId',
      key: 'tableId',
      width: 80,
    },
    {
      title: 'Items',
      dataIndex: 'items',
      key: 'items',
      render: items => (
        <div>
          {items?.map((item, index) => (
            <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              {item.menuItem?.imageUrl && (
                <img 
                  src={item.menuItem.imageUrl} 
                  alt={item.menuItem.name}
                  style={{ width: '20px', height: '20px', borderRadius: '4px', objectFit: 'cover' }}
                />
              )}
              <span>
                {item.menuItem?.name || `Item ${item.menuItemId}`} x{item.quantity}
              </span>
            </div>
          ))}
        </div>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: status => <Tag color={statusColors[status] || 'default'}>{status}</Tag>,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <>
          {record.status === 'pending' && (
            <Button onClick={() => handleStatusChange(record.id, 'in_progress')} style={{ marginRight: 8 }}>
              In Progress
            </Button>
          )}
          {record.status === 'in_progress' && (
            <Button onClick={() => handleStatusChange(record.id, 'ready')} style={{ marginRight: 8 }}>
              Ready
            </Button>
          )}
          {record.status === 'ready' && (
            <Button onClick={() => handleStatusChange(record.id, 'completed')}>
              Complete
            </Button>
          )}
        </>
      ),
    },
  ];

  return (
    <DashboardBox>
      <Typography.Title level={3}>Kitchen Dashboard</Typography.Title>
      <Table
        columns={columns}
        dataSource={orders}
        rowKey="id"
        loading={loading}
        pagination={false}
      />
    </DashboardBox>
  );
}

export default KitchenDashboard; 