import React from 'react';
import styled from 'styled-components';
import Menu from '../components/Menu.jsx';
import Cart from '../components/Cart.jsx';
import { useParams } from 'react-router-dom';

const PageContainer = styled.div`
  display: flex;
  flex-direction: row;
  min-height: 100vh;
  background: #f8f9fa;
  @media (max-width: 900px) {
    flex-direction: column;
  }
`;

const MainContent = styled.div`
  flex: 2;
  padding: 2.5rem 2rem 2rem 2rem;
  max-width: 900px;
  margin: 0 auto;
`;

const Sidebar = styled.div`
  flex: 1;
  max-width: 350px;
  min-width: 280px;
  background: #fff;
  border-left: 1px solid #eee;
  box-shadow: 0 0 24px rgba(30,34,90,0.04);
  padding: 2.5rem 1.5rem 2rem 1.5rem;
  @media (max-width: 900px) {
    max-width: 100%;
    border-left: none;
    border-top: 1px solid #eee;
    box-shadow: none;
    padding: 1.5rem 1rem;
  }
`;

const Title = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  color: #1a2233;
  margin-bottom: 1.5rem;
  text-align: left;
  letter-spacing: 1px;
`;

function CustomerPage() {
  const { tableId } = useParams();
  return (
    <PageContainer>
      <MainContent>
        <Title>
          Menu & Order{tableId ? ` (Table ${tableId})` : ''}
        </Title>
        <Menu readOnly={false} />
      </MainContent>
      <Sidebar>
        <Cart tableId={tableId} />
      </Sidebar>
    </PageContainer>
  );
}

export default CustomerPage; 