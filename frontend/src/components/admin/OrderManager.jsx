import React, { useEffect, useState } from 'react';
import { Table, Tag, Button, Modal, Select, message, Typography, Popconfirm } from 'antd';
import useStore from '../../store';
import { fetchOrders, updatePayment as apiUpdatePayment, deleteOrder as apiDeleteOrder } from '../../api';

const statusColors = {
  pending: 'orange',
  in_progress: 'blue',
  ready: 'green',
  completed: 'default',
};

function OrderManager() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState({ open: false, order: null });
  const [paymentStatus, setPaymentStatus] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const token = useStore(state => state.token);
  const isAdmin = useStore(state => state.isAdmin());

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

  const openPaymentModal = (order) => {
    setPaymentStatus(order.paymentStatus || 'pending');
    setPaymentMethod(order.paymentMethod || '');
    setModal({ open: true, order });
  };

  const handlePaymentUpdate = async () => {
    try {
      await apiUpdatePayment(modal.order.id, paymentStatus, paymentMethod, token);
      message.success('Payment updated');
      setModal({ open: false, order: null });
      loadOrders();
    } catch (err) {
      message.error('Failed to update payment');
    }
  };

  const handleDelete = async (id) => {
    try {
      await apiDeleteOrder(id, token);
      message.success('Order deleted');
      loadOrders();
    } catch (err) {
      message.error('Failed to delete order');
    }
  };

  const columns = [
    { title: 'Order ID', dataIndex: 'id', key: 'id', width: 80 },
    { title: 'Table', dataIndex: 'tableId', key: 'tableId', width: 80 },
    {
      title: 'Items',
      dataIndex: 'items',
      key: 'items',
      render: items => items.map(i => `${i.menuItemId} x${i.quantity}`).join(', '),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: status => <Tag color={statusColors[status] || 'default'}>{status}</Tag>,
    },
    {
      title: 'Payment',
      key: 'payment',
      render: (_, record) => (
        <>
          <Tag color={record.paymentStatus === 'paid' ? 'green' : 'red'}>
            {record.paymentStatus || 'pending'}
          </Tag>
          {record.paymentStatus === 'paid' && record.paymentMethod && (
            <Tag color="blue">{record.paymentMethod}</Tag>
          )}
        </>
      ),
    },
    isAdmin && {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <>
          <Button size="small" onClick={() => openPaymentModal(record)} style={{ marginRight: 8 }}>
            Update Payment
          </Button>
          <Popconfirm title="Delete this order?" onConfirm={() => handleDelete(record.id)} okText="Yes" cancelText="No">
            <Button danger size="small">Delete</Button>
          </Popconfirm>
        </>
      ),
    },
  ].filter(Boolean);

  return (
    <div>
      <Typography.Title level={4}>Orders & Payments</Typography.Title>
      <Table columns={columns} dataSource={orders} rowKey="id" loading={loading} pagination={false} />
      <Modal
        title={`Update Payment for Order #${modal.order?.id}`}
        open={modal.open}
        onOk={handlePaymentUpdate}
        onCancel={() => setModal({ open: false, order: null })}
        okText="Update"
      >
        <div style={{ marginBottom: 16 }}>
          <Typography.Text strong>Payment Status:</Typography.Text>
          <Select
            value={paymentStatus}
            onChange={setPaymentStatus}
            style={{ width: 120, marginLeft: 8 }}
            options={[
              { value: 'pending', label: 'Pending' },
              { value: 'paid', label: 'Paid' },
            ]}
          />
        </div>
        <div>
          <Typography.Text strong>Payment Method:</Typography.Text>
          <Select
            value={paymentMethod}
            onChange={setPaymentMethod}
            style={{ width: 120, marginLeft: 8 }}
            options={[
              { value: 'cash', label: 'Cash' },
              { value: 'card', label: 'Card' },
            ]}
          />
        </div>
      </Modal>
    </div>
  );
}

export default OrderManager; 