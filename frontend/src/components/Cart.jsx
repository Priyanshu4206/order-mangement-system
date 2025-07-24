import React, { useState } from 'react';
import styled from 'styled-components';
import { List, InputNumber, Button, message, Typography } from 'antd';
import useStore from '../store';

const CartBox = styled.div`
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  padding: 1.5rem;
  margin: 2rem 0;
`;

function Cart({ tableId: propTableId }) {
  const { cart, clearCart, placeOrder, loading, error } = useStore();
  const [tableId, setTableId] = useState('');
  const [success, setSuccess] = useState(null);
  const effectiveTableId = propTableId || tableId;

  const handleOrder = async () => {
    try {
      const resp = await placeOrder(Number(effectiveTableId));
      setSuccess('Order placed!');
      clearCart();
      message.success('Order placed!');
    } catch (err) {
      setSuccess(null);
      message.error('Failed to place order');
    }
  };

  if (!cart.length) return null;

  return (
    <CartBox>
      <Typography.Title level={4}>Your Cart</Typography.Title>
      <List
        dataSource={cart}
        renderItem={(item, idx) => (
          <List.Item key={idx}>
            <span>{item.name}</span>
            <span>Qty: {item.quantity || 1}</span>
          </List.Item>
        )}
      />
      {!propTableId && (
        <InputNumber
          min={1}
          placeholder="Table Number"
          value={tableId}
          onChange={value => setTableId(value)}
          style={{ marginTop: '1rem', width: 120 }}
        />
      )}
      <Button
        type="primary"
        onClick={handleOrder}
        loading={loading}
        disabled={!effectiveTableId}
        style={{ marginLeft: 16 }}
      >
        Place Order
      </Button>
      {error && <div style={{ color: 'red', marginTop: 8 }}>Error: {error}</div>}
      {success && <div style={{ color: 'green', marginTop: 8 }}>{success}</div>}
    </CartBox>
  );
}

export default Cart; 