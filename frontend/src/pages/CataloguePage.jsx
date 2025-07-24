import React, { useEffect } from 'react';
import styled from 'styled-components';
import { Card, Typography } from 'antd';
import { Utensils, LoaderCircle, Frown } from 'lucide-react';
import useStore from '../store';

const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  color: #1a2233;
  margin-bottom: 1.5rem;
  text-align: center;
  letter-spacing: 1px;
`;

const MenuGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 2rem;
`;

const StyledCard = styled(Card)`
  border-radius: 18px !important;
  box-shadow: 0 4px 24px rgba(30, 34, 90, 0.08);
  border: none !important;
  background: linear-gradient(135deg, #fff 80%, #f3f6fa 100%);
  .ant-card-head-title {
    font-size: 1.3rem;
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

function CataloguePage() {
  const { menu, fetchMenu, loading, error } = useStore();

  useEffect(() => { fetchMenu(); }, [fetchMenu]);

  return (
    <PageContainer>
      <Title>
        <Utensils size={32} style={{ verticalAlign: 'middle', marginRight: 12 }} />
        Explore Our Exquisite Menu
      </Title>
      {loading ? (
        <Placeholder>
          <LoaderCircle size={48} className="spin" />
          <div style={{ marginTop: 16 }}>Loading menu...</div>
        </Placeholder>
      ) : error ? (
        <Placeholder>
          <Frown size={48} />
          <div style={{ marginTop: 16 }}>Failed to load menu.</div>
        </Placeholder>
      ) : menu.length === 0 ? (
        <Placeholder>
          <Utensils size={48} />
          <div style={{ marginTop: 16 }}>No menu items available yet.</div>
        </Placeholder>
      ) : (
        <MenuGrid>
          {menu.map((item) => (
            <StyledCard
              key={item.id}
              title={item.name}
              bordered={false}
              extra={<Price>${item.price.toFixed(2)}</Price>}
            >
              <p style={{ minHeight: 60 }}>{item.description}</p>
            </StyledCard>
          ))}
        </MenuGrid>
      )}
    </PageContainer>
  );
}

export default CataloguePage; 