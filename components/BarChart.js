'use client';

// src/components/BarChart.js
import React, { useMemo } from 'react';
import styled from 'styled-components';
import { darkTheme } from '@/styles/darkTheme';

const ChartWrapper = styled.div`
  background: ${darkTheme.background.panel};
  padding: 24px;
  border-radius: ${darkTheme.radius.xl};
  box-shadow: ${darkTheme.shadow.soft};
  margin-bottom: 30px;
  border: 1px solid ${darkTheme.border.light};
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  /* Subtle glow effect on hover */
  &:hover {
    box-shadow: ${darkTheme.shadow.medium};
    transform: translateY(-2px);
    border-color: ${darkTheme.accent.cyan};
  }

  /* Decorative gradient top border for premium feel */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: ${darkTheme.accent.gradient};
    opacity: 0.8;
    box-shadow: ${darkTheme.accent.glowCyan};
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 12px;
  border-bottom: 2px solid ${darkTheme.border.light};
`;

const Title = styled.h3`
  font-size: 1.3rem;
  font-weight: 700;
  color: ${darkTheme.text.primary};
  background: ${darkTheme.accent.gradient};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const ChartPlaceholder = styled.div`
  width: 100%;
  height: 400px;
  background: ${darkTheme.background.glass};
  backdrop-filter: blur(8px);
  border-radius: ${darkTheme.radius.md};
  padding: 20px 24px 50px 24px;
  display: flex;
  align-items: flex-end;
  gap: 12px;
  position: relative;
  box-shadow: ${darkTheme.shadow.inner};
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

  /* Grid lines for better visual context */
  background-image:
    linear-gradient(to bottom, transparent 99%, rgba(27, 211, 255, 0.08) 1%);
  background-size: 100% 25%;

  &::before {
      content: '${props => props.showPlaceholder ? 'Income Overview (No Data Available)' : ''}';
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      color: ${darkTheme.text.secondary};
      font-style: italic;
      font-weight: 500;
      z-index: 2;
      background: ${darkTheme.background.panel};
      padding: 8px 16px;
      border-radius: ${darkTheme.radius.sm};
      box-shadow: ${darkTheme.shadow.soft};
  }
`;

const Bar = styled.div`
  flex: 1;
  /* Dynamic gradient based on chart type - teal for income, purple for expense */
  background: ${props => props.chartType === 'expense'
    ? darkTheme.accent.gradientPurple
    : darkTheme.accent.gradient};
  height: ${props => props.height * 100}%;
  border-radius: 8px 8px 0 0;
  opacity: 0.95;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  box-shadow: ${props => props.chartType === 'expense'
    ? darkTheme.accent.glowTeal
    : darkTheme.accent.glowCyan};
  animation: barGrow 0.6s ease-out ${props => props.index * 0.1}s both;

  @keyframes barGrow {
    from {
      height: 0;
      opacity: 0;
    }
    to {
      height: ${props => props.height * 100}%;
      opacity: 0.9;
    }
  }

  /* Glossy effect overlay */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 40%;
    background: linear-gradient(180deg, rgba(255, 255, 255, 0.15) 0%, transparent 100%);
    border-radius: 8px 8px 0 0;
  }

  &:hover {
    opacity: 1;
    transform: translateY(-4px) scale(1.02);
    box-shadow: ${props => props.chartType === 'expense'
      ? '0 -8px 20px rgba(124, 92, 255, 0.4)'
      : '0 -8px 20px rgba(27, 211, 255, 0.4)'};
  }

  &::after {
    content: '${props => props.label}';
    position: absolute;
    bottom: -35px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 0.8rem;
    font-weight: 600;
    color: ${darkTheme.text.secondary};
    text-align: center;
    white-space: nowrap;
    max-width: 100px;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

const BarChart = ({ title, data = [], refreshTrigger, type = 'income' }) => {
  // ✅ Compute normalized heights for data
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const bars = useMemo(() => {
    if (!data || data.length === 0) return [];

    const maxAmount = Math.max(...data.map(item => item.amount || 0));
    if (maxAmount === 0) return [];

    return data.map(item => ({
      label: item.title || item.name || 'Untitled',
      height: (item.amount || 0) / maxAmount, // normalize 0–1
    }));
  }, [data, refreshTrigger]);

  return (
    <ChartWrapper>
      <Header>
        <Title>{title}</Title>
      </Header>

      <ChartPlaceholder showPlaceholder={bars.length === 0}>
        {bars.length > 0 &&
          bars.map((bar, index) => (
            <Bar
              key={index}
              index={index}
              height={bar.height}
              label={bar.label}
              chartType={type}
            />
          ))}
      </ChartPlaceholder>
    </ChartWrapper>
  );
};

export default BarChart;
