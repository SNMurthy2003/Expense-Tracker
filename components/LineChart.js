'use client';

// src/components/LineChart.js
import React from 'react';
import styled from 'styled-components';

const ChartWrapper = styled.div`
  background: linear-gradient(135deg, white 0%, #fdfcff 100%);
  padding: 24px;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06), 0 2px 4px rgba(0, 0, 0, 0.03);
  margin-bottom: 30px;
  border: 1px solid rgba(124, 58, 237, 0.08);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  /* Subtle glow effect on hover */
  &:hover {
    box-shadow: 0 6px 20px rgba(124, 58, 237, 0.12), 0 3px 8px rgba(0, 0, 0, 0.04);
    transform: translateY(-2px);
  }

  /* Decorative gradient overlay for premium feel */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, #7c3aed 0%, #06b6d4 50%, #10b981 100%);
    opacity: 0.6;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 12px;
  border-bottom: 2px solid var(--background-light);
`;

const Title = styled.h3`
  font-size: 1.3rem;
  font-weight: 700;
  color: var(--text-dark);
  background: linear-gradient(135deg, #7c3aed 0%, #06b6d4 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const ChartPlaceholder = styled.div`
  width: 100%;
  height: 320px;
  background: linear-gradient(135deg, #f8f9ff 0%, #fef3ff 100%);
  border-radius: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: var(--text-muted);
  font-size: 1rem;
  /* Modern grid with enhanced styling */
  background-image:
    linear-gradient(to right, transparent 99%, rgba(124, 58, 237, 0.08) 1%),
    linear-gradient(to bottom, transparent 99%, rgba(124, 58, 237, 0.08) 1%);
  background-size: 20% 100%, 100% 25%;
  position: relative;
  box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.03);
  animation: fadeIn 0.6s ease-out;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: scale(0.98);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  &::before {
      content: 'Expense Trend (Placeholder Line Chart)';
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      color: var(--text-muted);
      font-style: italic;
      font-weight: 500;
      z-index: 2;
      background: rgba(255, 255, 255, 0.9);
      padding: 8px 16px;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  }

  /* Enhanced line path with modern gradient and glow */
  &::after {
    content: '';
    position: absolute;
    width: 90%;
    height: 12px;
    background: linear-gradient(to right,
        rgba(124, 58, 237, 0.3) 0%,
        #7c3aed 20%,
        #06b6d4 50%,
        #10b981 80%,
        rgba(16, 185, 129, 0.3) 100%);
    top: 50%;
    transform: translateY(-50%) rotate(-3deg);
    border-radius: 8px;
    opacity: 0.7;
    filter: blur(1px);
    box-shadow: 0 4px 12px rgba(124, 58, 237, 0.3);
    animation: pulse 2s ease-in-out infinite;
  }

  @keyframes pulse {
    0%, 100% {
      opacity: 0.6;
      transform: translateY(-50%) rotate(-3deg) scale(1);
    }
    50% {
      opacity: 0.8;
      transform: translateY(-50%) rotate(-3deg) scale(1.02);
    }
  }
`;

const LineChart = ({ title }) => {
  return (
    <ChartWrapper>
      <Header>
        <Title>{title}</Title>
        {/* Removed AddButton since it's now handled in the page component */}
      </Header>
      <ChartPlaceholder />
    </ChartWrapper>
  );
};

export default LineChart;