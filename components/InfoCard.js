// src/components/InfoCard.js
import React from 'react';
import styled from 'styled-components';
import { darkTheme } from '@/styles/darkTheme';

const CardWrapper = styled.div`
  background: ${darkTheme.background.panel};
  padding: 24px;
  border-radius: ${darkTheme.radius.lg};
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: ${darkTheme.shadow.soft};
  flex: 1;
  min-width: 200px;
  border: 1px solid ${darkTheme.border.light};
  border-top: 2px solid ${props => {
    switch(props.type) {
      case 'income': return darkTheme.accent.teal;
      case 'expense': return darkTheme.accent.purple;
      default: return darkTheme.accent.cyan;
    }
  }};
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: ${props => {
      switch(props.type) {
        case 'income': return darkTheme.accent.teal;
        case 'expense': return darkTheme.accent.purple;
        default: return darkTheme.accent.cyan;
      }
    }};
    box-shadow: ${props => {
      switch(props.type) {
        case 'income': return darkTheme.accent.glowTeal;
        case 'expense': return '0 0 20px rgba(124, 92, 255, 0.3)';
        default: return darkTheme.accent.glowCyan;
      }
    }};
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover {
    transform: translateY(-4px);
    box-shadow: ${darkTheme.shadow.medium};
    border-color: ${props => {
      switch(props.type) {
        case 'income': return darkTheme.accent.teal;
        case 'expense': return darkTheme.accent.purple;
        default: return darkTheme.accent.cyan;
      }
    }};

    &::before {
      opacity: 1;
    }
  }
`;

const IconCircle = styled.div`
  width: 56px;
  height: 56px;
  border-radius: ${darkTheme.radius.lg};
  background: ${props => {
    switch(props.type) {
      case 'income': return 'linear-gradient(135deg, rgba(45, 212, 191, 0.15) 0%, rgba(45, 212, 191, 0.08) 100%)';
      case 'expense': return 'linear-gradient(135deg, rgba(124, 92, 255, 0.15) 0%, rgba(124, 92, 255, 0.08) 100%)';
      default: return 'linear-gradient(135deg, rgba(27, 211, 255, 0.15) 0%, rgba(27, 211, 255, 0.08) 100%)';
    }
  }};
  color: ${props => {
    switch(props.type) {
      case 'income': return darkTheme.accent.teal;
      case 'expense': return darkTheme.accent.purple;
      default: return darkTheme.accent.cyan;
    }
  }};
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.6rem;
  transition: all 0.3s ease;
  border: 1px solid ${props => {
    switch(props.type) {
      case 'income': return 'rgba(45, 212, 191, 0.2)';
      case 'expense': return 'rgba(124, 92, 255, 0.2)';
      default: return 'rgba(27, 211, 255, 0.2)';
    }
  }};

  ${CardWrapper}:hover & {
    transform: scale(1.08);
    box-shadow: ${props => {
      switch(props.type) {
        case 'income': return darkTheme.accent.glowTeal;
        case 'expense': return '0 0 20px rgba(124, 92, 255, 0.3)';
        default: return darkTheme.accent.glowCyan;
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
`;

const Amount = styled.h3`
  font-size: 1.65rem;
  font-weight: 700;
  color: ${darkTheme.text.primary};
  transition: color 0.3s ease;

  ${CardWrapper}:hover & {
    color: ${props => {
      switch(props.type) {
        case 'income': return darkTheme.accent.teal;
        case 'expense': return darkTheme.accent.purple;
        default: return darkTheme.accent.cyan;
      }
    }};
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