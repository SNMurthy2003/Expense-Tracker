'use client';

import React from 'react';
import styled from 'styled-components';
import Sidebar from './Sidebar';

const AppLayoutWrapper = styled.div`
  display: flex;
  height: 100vh;
  width: 100%;
  overflow: hidden;
  background: #071422;
`;

const ContentArea = styled.div`
  flex-grow: 1;
  height: 100vh;
  overflow-y: auto;
  overflow-x: hidden;
`;

const AppLayout = ({ children, onLogout }) => {
  return (
    <AppLayoutWrapper>
      <Sidebar onLogout={onLogout} />
      <ContentArea>
        {children}
      </ContentArea>
    </AppLayoutWrapper>
  );
};

export default AppLayout;
