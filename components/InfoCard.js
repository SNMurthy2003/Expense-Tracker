// src/components/InfoCard.js
import React from 'react';
import styled from 'styled-components';
import { darkTheme } from '@/styles/darkTheme';

const CardWrapper = styled.div`
  background: ${darkTheme.background.panel};
  padding: 24px;
  border-radius: ${darkTheme.radius.md};
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: ${darkTheme.shadow.cardShadow};
  flex: 1;
  min-width: 200px;
  border: 1px solid ${darkTheme.border.card};
  transition: all ${darkTheme.transition.normal};
  position: relative;
  overflow: hidden;
  font-family: ${darkTheme.font.primary};

  &:hover {
    transform: scale(1.05);
    box-shadow: ${darkTheme.shadow.glow};
    border-color: ${darkTheme.border.accent};
  }
`;

const IconCircle = styled.div`
  width: 56px;
  height: 56px;
  border-radius: ${darkTheme.radius.md};
  background: ${props => {
    switch(props.type) {
      case 'income': return 'linear-gradient(135deg, rgba(45, 212, 191, 0.15) 0%, rgba(45, 212, 191, 0.08) 100%)';
      case 'expense': return 'linear-gradient(135deg, rgba(176, 101, 255, 0.15) 0%, rgba(176, 101, 255, 0.08) 100%)';
      default: return 'linear-gradient(135deg, rgba(176, 101, 255, 0.15) 0%, rgba(176, 101, 255, 0.08) 100%)';
    }
  }};
  color: ${props => {
    switch(props.type) {
      case 'income': return darkTheme.chart.income;
      case 'expense': return darkTheme.brand.primary;
      default: return darkTheme.brand.primary;
    }
  }};
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.6rem;
  transition: all ${darkTheme.transition.normal};
  border: 1px solid ${props => {
    switch(props.type) {
      case 'income': return 'rgba(45, 212, 191, 0.2)';
      case 'expense': return 'rgba(176, 101, 255, 0.2)';
      default: return 'rgba(176, 101, 255, 0.2)';
    }
  }};

  ${CardWrapper}:hover & {
    transform: scale(1.08);
    color: ${props => {
      switch(props.type) {
        case 'income': return darkTheme.chart.income;
        case 'expense': return darkTheme.brand.primary;
        default: return darkTheme.brand.primary;
      }
    }};
  }
`;

const Content = styled.div`
  text-align: right;
`;

const Title = styled.p`
  color: ${darkTheme.text.secondary};
  font-size: 0.88rem;
  margin-bottom: 6px;
  font-weight: 500;
  letter-spacing: 0.3px;
  text-transform: uppercase;
  font-family: ${darkTheme.font.primary};
`;

const Amount = styled.h3`
  font-size: 1.65rem;
  font-weight: 700;
  color: ${darkTheme.text.primary};
  transition: color ${darkTheme.transition.normal};
  font-family: ${darkTheme.font.primary};

  ${CardWrapper}:hover & {
    color: ${darkTheme.brand.primary};
  }
`;

// Note: The icon is destructured as 'Icon' and rendered below.
// This is the correct pattern when receiving a component via props.
const InfoCard = ({ title, amount, type, icon: Icon }) => {
  return (
    <CardWrapper type={type}>
      <IconCircle type={type}>
        {/* The Icon prop (e.g., FaWallet) is rendered here */}
        <Icon />
      </IconCircle>
      <Content>
        <Title>{title}</Title>
        <Amount type={type}>{amount}</Amount>
      </Content>
    </CardWrapper>
  );
};

export default InfoCard;