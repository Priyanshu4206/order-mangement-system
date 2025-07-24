import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Card, Button, Typography, InputNumber } from 'antd';
import { LoaderCircle, Frown, Utensils } from 'lucide-react';
import useStore from '../store';

const MenuGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.5rem;
  margin: 2rem 0;
`;

const StyledCard = styled(Card)`
  border-radius: 16px !important;
  box-shadow: 0 4px 24px rgba(30, 34, 90, 0.08);
  border: none !important;
  background: linear-gradient(135deg, #fff 80%, #f3f6fa 100%);
  .ant-card-head-title {
    font-size: 1.1rem;
    font-weight: 600;
    color: #2d3a4b;
  }
`;

const Price = styled(Typography.Text)`
  font-size: 1.1rem;
  color: #bfa14a;
  font-weight: 700;
`;

const Placeholder = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 300px;
  color: #bfa14a;
  opacity: 0.7;
`;

function Menu({ readOnly = false }) {
  const { menu, fetchMenu, addToCart, loading, error } = useStore();
  const [quantities, setQuantities] = useState({});

  useEffect(() => { fetchMenu(); }, [fetchMenu]);

  const handleQuantityChange = (id, value) => {
    setQuantities(q => ({ ...q, [id]: value }));
  };

  const handleAddToCart = (item) => {
    const quantity = quantities[item.id] || 1;
    addToCart({ ...item, quantity });
    setQuantities(q => ({ ...q, [item.id]: 1 }));
  };

  if (loading) return (
    <Placeholder>
      <LoaderCircle size={40} className="spin" />
      <div style={{ marginTop: 12 }}>Loading menu...</div>
    </Placeholder>
  );
  if (error) return (
    <Placeholder>
      <Frown size={40} />
      <div style={{ marginTop: 12 }}>Failed to load menu.</div>
    </Placeholder>
  );
  if (menu.length === 0) return (
    <Placeholder>
      <Utensils size={40} />
      <div style={{ marginTop: 12 }}>No menu items available.</div>
    </Placeholder>
  );

  return (
    <MenuGrid>
      {menu.map((item) => (
        <StyledCard
          key={item.id}
          title={item.name}
          bordered={false}
          extra={<Price>${item.price.toFixed(2)}</Price>}
        >
          <p style={{ minHeight: 60 }}>{item.description}</p>
          {!readOnly && (
            <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              <InputNumber
                min={1}
                value={quantities[item.id] || 1}
                onChange={val => handleQuantityChange(item.id, val)}
                style={{ width: 60 }}
              />
              <Button
                type="primary"
                onClick={() => handleAddToCart(item)}
                style={{ marginLeft: 8 }}
              >
                Add to Cart
              </Button>
            </div>
          )}
        </StyledCard>
      ))}
    </MenuGrid>
  );
}

export default Menu; 